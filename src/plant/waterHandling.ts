import * as Phaser from "phaser";
import { Events } from "../events/events";
import MapManager from "../map/mapManager";
import PlantData, { Position } from "./plantData";
import Game_Config from "../game_config";

export type waterStats = {
    waterAdded: number,
    waterRemoved: number,
    totalWater: number
}

export default class WaterHandler {

    private rootsCloseToWater: Position[];
    private waterSources: Position[];

    private _mapManager: MapManager;

    constructor(scene: Phaser.Scene , mapManager: MapManager){

        this._mapManager = mapManager;
        
        scene.events.on(Events.AbsorbWater, (plantData: PlantData) => {
            let waterStats: waterStats = {totalWater: 0, waterAdded: 0, waterRemoved: 0};
            this.checkIfCloseToWater(plantData, mapManager);
            this.removeSurroundingWater();
            waterStats.waterRemoved = this.calculateWaterToRemoveFromPlant(plantData);
            waterStats.waterAdded = this.calculateWaterToAddToPlant(plantData);
            this.updatePlantWaterData(scene, plantData, waterStats);
        })


    }

    private removeSurroundingWater(): void {
        this.waterSources.forEach(pos => {
            this._mapManager.mapData.landGenerator.landData[pos.y][pos.x].water -= 1;
            if(this._mapManager.mapData.landGenerator.landData[pos.y][pos.x].water < 0){
                this._mapManager.mapData.landGenerator.landData[pos.y][pos.x].water = 0;
            }
            this._mapManager.mapDisplay.updateTile(pos);
        })
    }

    private updatePlantWaterData(scene: Phaser.Scene,plantData: PlantData, waterStats: waterStats): void{
        waterStats.totalWater = plantData.water;

        if(!plantData.ai){
            scene.events.emit(Events.WaterText, waterStats);
        }
    }

    private calculateWaterToAddToPlant( plantData: PlantData): number {
        let waterToAdd = 0;

        this.waterSources.forEach(watersource => {
            waterToAdd += Game_Config.WATER_ADD_AMOUNT;
        })

        plantData.water += waterToAdd;
        return waterToAdd;
    }

    private calculateWaterToRemoveFromPlant(plantData: PlantData): number {
        let biomass = plantData.__rootData.length;
        let waterToRemove = (biomass * Game_Config.WATER_SUBTRACT_AMOUNT);
        plantData.water -= waterToRemove;

        return waterToRemove;
    }

    private checkIfCloseToWater(plantData: PlantData, mapManager: MapManager): void {

        this.waterSources = [];
        this.rootsCloseToWater = [];

        plantData.__rootData.forEach( pos => {
            let N = false;
            let E = false;
            let S = false;
            let W = false
            if(mapManager.mapData.landGenerator.landData[pos.y - 1][pos.x]){
                N = mapManager.mapData.landGenerator.landData[pos.y - 1][pos.x].water > 0;
            }
            if(mapManager.mapData.landGenerator.landData[pos.y][pos.x + 1]){
                E = mapManager.mapData.landGenerator.landData[pos.y][pos.x + 1].water > 0;
            }
            if(mapManager.mapData.landGenerator.landData[pos.y + 1][pos.x]){
                S = mapManager.mapData.landGenerator.landData[pos.y + 1][pos.x].water > 0;
            }
            if(mapManager.mapData.landGenerator.landData[pos.y][pos.x - 1]){
                W = mapManager.mapData.landGenerator.landData[pos.y][pos.x - 1].water > 0;
            }

            // let N = mapManager.mapData.landGenerator.landData[pos.y - 1][pos.x].water > 0;
            // let E = mapManager.mapData.landGenerator.landData[pos.y][pos.x + 1].water > 0;
            // let S = mapManager.mapData.landGenerator.landData[pos.y + 1][pos.x].water > 0;
            // let W = mapManager.mapData.landGenerator.landData[pos.y][pos.x - 1].water > 0;

            if(N){
                this.waterSources.push({x: pos.x, y: pos.y-1});
            } 
            if(E){
                this.waterSources.push({x: pos.x+1, y: pos.y});
            }
            if(S){
                this.waterSources.push({x: pos.x, y: pos.y+1});
            }
            if(W){
                this.waterSources.push({x: pos.x-1, y: pos.y});
            }

            if(N || E || S || W){
                this.rootsCloseToWater.push(pos);
            }
        })

    }

}