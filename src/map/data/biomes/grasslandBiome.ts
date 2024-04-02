import Game_Config from "../../../game_config";
import { BiomeType } from "../biomeManager";
import { LandTypes } from "../landGenerator";
import MapData from "../mapData";
import IBiome, { BiomeBase } from "./biomeInterface";
import * as Phaser from "phaser";



export default class GrasslandBiome extends BiomeBase implements IBiome {

    biomeType: BiomeType = BiomeType.Grassland;
    landType: LandTypes = LandTypes.Normal;

    addImages(): void {
        
    }

    addMinerals(): void {
        
    }
}