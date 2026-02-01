import Game_Config from "../../game_config";
import MapData from "./mapData";
import * as Phaser from "phaser";
import GrasslandBiome from "./biomes/grasslandBiome";
import SandlandBiome from "./biomes/sandBiome";
import { BiomeBase } from "./biomes/biomeInterface";

const ROWLENGTH = 25;

export enum BiomeType {
    Grassland = "Grassland",
    Sandy = "Sandy"
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

    biomes: BiomeBase[] = [];

    constructor(mapData: MapData, scene: Phaser.Scene){
        this._mapData = mapData;
        this._scene = scene;

        this.setBiome();

       
    }

// TODO: sort out the creation of different biomes
    setBiome(){
        const biomeChoices = [BiomeType.Grassland, BiomeType.Sandy]
        const biomeSizes = 50;
        for(let xChunk = 0; xChunk<Game_Config.MAP_SIZE.x; xChunk+=biomeSizes){
            const biome_type = biomeChoices[Math.floor(Math.random()*biomeChoices.length)];
            let biome: BiomeBase;
            switch (biome_type) {
                case BiomeType.Grassland:
                    biome = new GrasslandBiome(this._scene, this._mapData);
                    break
                case BiomeType.Sandy:
                    biome = new SandlandBiome(this._scene, this._mapData);
                    break
                default:
                    break;
            }
            biome.createBiome(xChunk, biomeSizes);
            this.biomes.push(biome);
        } 
    }
}