import Game_Config from "../../game_config";
import LandData from "./landData";
import { LandTypes } from "./landGenerator";
import MapData from "./mapData";
import { RuleTile } from "../display/ruleTileSets";
import * as Phaser from "phaser";
import IBiome from "./biomes/biomeInterface";
import GrasslandBiome from "./biomes/grasslandBiome";
import SandlandBiome from "./biomes/sandBiome";

const ROWLENGTH = 25;

export enum BiomeType {
    Grassland,
    Sandy
}

export enum BiomeTiles {
    Vines,
    Grassland,
    Mushrooms,
    SandSurface
}

export class BiomeTileSets {
    static testSet = new Map<BiomeTiles, integer[]>([
        [BiomeTiles.Vines, [(6 * ROWLENGTH) + 9, (6 * ROWLENGTH) + 10]],
        [BiomeTiles.Grassland, [(6 * ROWLENGTH) + 11, (6 * ROWLENGTH) + 12, (6 * ROWLENGTH) + 13, (6 * ROWLENGTH) + 14]],
        [BiomeTiles.Mushrooms, [(22 * ROWLENGTH) + 4]],
        [BiomeTiles.SandSurface, [(7*ROWLENGTH) + 9, (7*ROWLENGTH) + 10]]

    ])
}



export default class BiomeManager {

    _mapData: MapData;
    _scene: Phaser.Scene;

    biomes: IBiome[] = [];

    constructor(mapData: MapData, scene: Phaser.Scene){
        this._mapData = mapData;
        this._scene = scene;

        this.setBiome();


       
    }

// TODO: sort out the creation of different biomes
    setBiome(){

        let biomeChoices = [BiomeType.Grassland, BiomeType.Sandy]
        let biomeSizes = 50;

        for(let xChunk = 0; xChunk<Game_Config.MAP_SIZE.x; xChunk+=biomeSizes){

            let biome = biomeChoices[Math.floor(Math.random()*biomeChoices.length)];
            let b: IBiome;
            if(biome == BiomeType.Grassland){
                b = new GrasslandBiome(this._scene, this._mapData);
            } else {    
                b = new SandlandBiome(this._scene, this._mapData);
            }
            b.createBiome(xChunk, biomeSizes);
            this.biomes.push(b);

        }
    }

    addImages(){
        this.biomes.forEach(biome => {
            biome.addImages();
        })
    }
    addMinerals(){
        this.biomes.forEach(biome => {
            biome.addMinerals();
        })
    }


}