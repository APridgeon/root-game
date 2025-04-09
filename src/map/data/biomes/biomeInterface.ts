import Game_Config from "../../../game_config";
import RuleTileSets from "../../display/ruleTileSets";
import { BiomeType } from "../biomeManager";
import LandData from "../landData";
import { LandTypes } from "../landGenerator";
import MapData from "../mapData";
import * as Phaser from "phaser";


export class BiomeBase {

    _mapData: MapData;
    _scene: Phaser.Scene;

    biomeType: BiomeType;
    landType: LandTypes;
    landData: LandData[] = [];


    constructor(scene: Phaser.Scene, mapData: MapData){
        this._scene = scene;
        this._mapData = mapData;
    }


    createBiome(x0: number, biomeSize: number): void {
        for(let y = 0; y < Game_Config.MAP_SIZE.y; y++){

            const xWobble = this._mapData._mapManager.noise.simplex2(0.5, y * 0.05);
            const xWobbleRounded = Phaser.Math.RoundTo(xWobble * 5, 0) - 5;

            for(let x = x0 + xWobbleRounded; x < x0 + biomeSize - xWobbleRounded; x++){
                const tile = this._mapData.landGenerator.landData[y][x]
                if(tile){
                    if(tile.biome) tile.removeFromBiome(); 
                    tile.biome = this;
                    tile.biomeType = this.biomeType;
                    this.landData.push(tile);
                    if(tile.isLand()){
                        tile.landType = this.landType;
                        tile.initStrength();
                    }
                }
            }
        }
        
        this.addWater();
        this.addMinerals();
        this.addImages();
   }

   addWater() {
   }

   addImages() {    
   }

   addMinerals() {    
   }

}