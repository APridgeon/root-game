import Game_Config from "../../../game_config";
import { RuleTile } from "../../display/ruleTileSets";
import { BiomeTiles, BiomeTileSets, BiomeType } from "../biomeManager";
import LandData from "../landData";
import { LandTypes } from "../landGenerator";
import MapData from "../mapData";
import { BiomeBase } from "./biomeInterface";
import * as Phaser from "phaser";



export default class GrasslandBiome extends BiomeBase  {


    biomeType: BiomeType = BiomeType.Grassland;
    landType: LandTypes = LandTypes.Normal;

    addWater(): void {
        this.landData.forEach(land => {
            if(land.pos.y > Game_Config.MAP_GROUND_LEVEL){
                const water = this._mapData.noise.simplex2((land.pos.x * 0.05) + 0.3, (land.pos.y * 0.05) + 0.3)
                land.water = (water > 0.3) && land.isLand() ? Game_Config.WATER_TILE_STARTING_AMOUNT : 0;
                land.phosphorous = false;
            }
        })
    }


    addImages(): void {
        this.landData.forEach(land => {
            this.addVines(land, land.pos.x, land.pos.y);
            this.addGrass(land, land.pos.x, land.pos.y);
            this.addMushrooms(land, land.pos.x, land.pos.y);
        })
    }

    addMinerals(): void {

        this.landData.forEach(land => {
            let r = this._mapData.noise.simplex2(land.pos.x * 0.05, land.pos.y * 0.05)
            land.phosphorous = (r > 0.5) && land.isLand() ? true : false;       
        })
    }


    addVines(land: LandData, x: integer, y: integer){
        if(y > 0){
            let aboveTile = this._mapData.landGenerator.landData[y - 1][x];
            if(land.landType == LandTypes.Normal && aboveTile.landType == LandTypes.Hole){

                let indeces = BiomeTileSets.testSet.get(BiomeTiles.Vines)
                let index = indeces[Math.floor(Math.random()*indeces.length)]
                land.biomeIndex = {index: index, pos: {x: 0, y: 0}};
            }
        }
    }

    addGrass(land: LandData, x: integer, y: integer){
        if(y > 0){
            let aboveTile = this._mapData.landGenerator.landData[y - 1][x];
            if( land.landType == LandTypes.Normal && aboveTile.landType == LandTypes.None){
                let indeces = BiomeTileSets.testSet.get(BiomeTiles.Grassland)
                let index = indeces[Math.floor(Math.random()*indeces.length)]
                land.biomeIndex = {index: index, pos: {x: 0, y: -1}};
            }
        }
    }

    addMushrooms(land: LandData, x: integer, y: integer){
        if(y > 0){
            let rand = Math.random();
            let aboveTile = this._mapData.landGenerator.landData[y - 1][x];
            if(land.landType == LandTypes.Normal && aboveTile.landType == LandTypes.Hole && rand < 0.2){
                let indeces = BiomeTileSets.testSet.get(BiomeTiles.Mushrooms)
                let index = indeces[Math.floor(Math.random()*indeces.length)]
                land.biomeIndex = {index: index, pos: {x: 0, y: -1}};
                
            }
        }
    }


}