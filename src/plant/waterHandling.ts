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
            this._mapManager.mapData.waterAmount[pos.y][pos.x] -= 1;
            if(this._mapManager.mapData.waterAmount[pos.y][pos.x] < 0){
                this._mapManager.mapData.waterAmount[pos.y][pos.x] = 0;
                this._mapManager.mapData.waterData[pos.y][pos.x] = false;
            }
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
        let biomass = plantData.rootData.flat(1).filter(value => value === true).length;
        let waterToRemove = (biomass * Game_Config.WATER_SUBTRACT_AMOUNT);
        plantData.water -= waterToRemove;

        return waterToRemove;
    }

    private checkIfCloseToWater(plantData: PlantData, mapManager: MapManager): void {

        this.waterSources = [];
        this.rootsCloseToWater = [];

        for(let x = 1; x < plantData.rootData[0].length -1; x++){
            for(let y = 1; y < plantData.rootData.length-1; y++){

                if(plantData.rootData[y][x]){
                    let N = mapManager.mapData.waterData[y - 1][x];
                    let E = mapManager.mapData.waterData[y][x + 1];
                    let S = mapManager.mapData.waterData[y + 1][x];
                    let W = mapManager.mapData.waterData[y][x - 1];
                    if(N){
                        this.waterSources.push({x: x, y: y-1});
                    } 
                    if(E){
                        this.waterSources.push({x: x+1, y: y});
                    }
                    if(S){
                        this.waterSources.push({x: x, y: y+1});
                    }
                    if(W){
                        this.waterSources.push({x: x-1, y: y});
                    }

                    if(N || E || S || W){
                        this.rootsCloseToWater.push({x: x, y: y});
                    }
                }
            }
        }
    }

}