import Game_Config from "../../../game_config";
import { RuleTile } from "../../display/ruleTileSets";
import { BiomeTiles, BiomeTileSets, BiomeType } from "../biomeManager";
import LandData from "../landData";
import { LandTypes } from "../landGenerator";
import MapData from "../mapData";
import IBiome, { BiomeBase } from "./biomeInterface";
import * as Phaser from "phaser";

export default class SandlandBiome extends BiomeBase implements IBiome {

    biomeType: BiomeType = BiomeType.Sandy;
    landType: LandTypes = LandTypes.Sandy;

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
            if((land.ruleTile == RuleTile.top || land.ruleTile == RuleTile.topLeft || land.ruleTile == RuleTile.topRight) && land.landType == LandTypes.Sandy && aboveTile.landType == LandTypes.None){
                let indeces = BiomeTileSets.testSet.get(BiomeTiles.SandSurface)
                let index = indeces[Math.floor(Math.random()*indeces.length)]
                land.biomeIndex = {index: index, pos: {x: 0, y: -1}};
            }
        }
    }
}