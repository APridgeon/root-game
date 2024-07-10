import Game_Config from "../../../game_config";
import { BiomeType } from "../biomeManager";
import LandData from "../landData";
import { LandTypes } from "../landGenerator";
import MapData from "../mapData";
import * as Phaser from "phaser";

export default interface IBiome {

    createBiome(x0: number, biomeSize: number): void;
    addWater(): void;
    addImages(): void;
    addMinerals(): void;

}

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

            let xWobble = this._mapData._mapManager.noise.simplex2(0.5, y * 0.05);
            let xWobbleRounded = Phaser.Math.RoundTo(xWobble * 5, 0) - 5;

            for(let x = x0 + xWobbleRounded; x < x0 + biomeSize - xWobbleRounded; x++){

                if(this._mapData.landGenerator.landData[y][x]){
                    let land = this._mapData.landGenerator.landData[y][x];
                    if(land.biome){
                        land.removeFromBiome(); 
                    }
                    land.biome = this;
                    land.biomeType = this.biomeType;
                    this.landData.push(land);
                    if(land.isLand()){
                        land.landType = this.landType;
                        land.initStrength();
                    }
                }
            }
        }
        this.addWater()
   }

   addWater() {
   }

}