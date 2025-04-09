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
        const landData = this._mapManager.mapData.landGenerator.landData;
        this.waterSources.forEach(pos => {
            const tile = landData[pos.y][pos.x]
            tile.water = (tile.water < 0) ? 0 : tile.water - 1; 
            this._mapManager.mapDisplay.updateTile(pos);
        })
    }

    private updatePlantWaterData(scene: Phaser.Scene,plantData: PlantData, waterStats: waterStats): void{
        waterStats.totalWater = plantData.water;
        if(!plantData.ai) scene.events.emit(Events.WaterText, waterStats);
    }

    private calculateWaterToAddToPlant( plantData: PlantData): number {
        const waterToAdd = this.waterSources.length * Game_Config.WATER_ADD_AMOUNT
        plantData.water += waterToAdd;
        return waterToAdd;
    }

    private calculateWaterToRemoveFromPlant(plantData: PlantData): number {
        const biomass = plantData.__rootData.length;
        const waterToRemove = (biomass * Game_Config.WATER_SUBTRACT_AMOUNT);
        plantData.water -= waterToRemove;
        return waterToRemove;
    }

    private checkIfCloseToWater(plantData: PlantData, mapManager: MapManager): void {
        this.waterSources = [];
        this.rootsCloseToWater = [];
        const landData = mapManager.mapData.landGenerator.landData;

        plantData.__rootData.forEach( pos => {
            const {x, y} = pos;

            const N = (landData[y-1][x] && landData[y-1][x].water > 0)
            const E = (landData[y][x+1] && landData[y][x+1].water > 0)
            const S = (landData[y+1][x] && landData[y+1][x].water > 0)
            const W = (landData[y][x-1] && landData[y][x-1].water > 0)

            if(N) this.waterSources.push({x: x, y: y-1});
            if(E) this.waterSources.push({x: x+1, y: y});
            if(S) this.waterSources.push({x: x, y: y+1});
            if(W) this.waterSources.push({x: x-1, y: y});
            
            if(N || E || S || W) this.rootsCloseToWater.push(pos);
        })
    }

}