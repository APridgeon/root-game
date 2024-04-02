import Game_Config from "../../../game_config";
import { BiomeType } from "../biomeManager";
import { LandTypes } from "../landGenerator";
import MapData from "../mapData";
import IBiome, { BiomeBase } from "./biomeInterface";
import * as Phaser from "phaser";

export default class SandlandBiome extends BiomeBase implements IBiome {

    biomeType: BiomeType = BiomeType.Sandy;
    landType: LandTypes = LandTypes.Sandy;

    addImages(): void {
        
    }

    addMinerals(): void {
        
    }
}