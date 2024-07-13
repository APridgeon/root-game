import Game_Config from "../../../game_config";
import { RuleTile } from "../../display/ruleTileSets";
import { BiomeTiles, BiomeTileSets, BiomeType } from "../biomeManager";
import LandData from "../landData";
import { LandTypes } from "../landGenerator";
import MapData from "../mapData";
import { BiomeBase } from "./biomeInterface";
import * as Phaser from "phaser";

export default class SandlandBiome extends BiomeBase {

    biomeType: BiomeType = BiomeType.Sandy;
    landType: LandTypes = LandTypes.Sandy;


    addWater(): void {
        this.landData.forEach(land => {
            if(land.pos.y > Game_Config.MAP_GROUND_LEVEL + 10){
                let water = this._mapData.noise.simplex2((land.pos.x * 0.05) + 0.3, (land.pos.y * 0.05) + 0.3)
                land.water = (water > 0.7) && land.isLand() ? Game_Config.WATER_TILE_STARTING_AMOUNT : 0;
                land.phosphorous = false;
            }
        })
    }

    addImages(): void {
        this.landData.forEach(land => {
            this.addSandSurface(land, land.pos.x, land.pos.y);
        })
    }

    addMinerals(): void {
        
    }
    
    addSandSurface(land: LandData, x: integer, y: integer){
        if(y > 0){
            let aboveTile = this._mapData.landGenerator.landData[y - 1][x];
            if(land.landType == LandTypes.Sandy && aboveTile.landType == LandTypes.None){
                let indeces = BiomeTileSets.testSet.get(BiomeTiles.SandSurface)
                let index = indeces[Math.floor(Math.random()*indeces.length)]
                land.biomeIndex = {index: index, pos: {x: 0, y: -1}};

            }
        }
    }
}