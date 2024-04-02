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

        let biomeChoices = [BiomeType.Grassland, BiomeType.Grassland, BiomeType.Grassland, BiomeType.Sandy]
        let biomeSizes = 50;

        for(let xChunk = 0; xChunk<Game_Config.MAP_SIZE.x; xChunk+=biomeSizes){

            let biome = biomeChoices[Math.floor(Math.random()*biomeChoices.length)];
            let b: IBiome;
            if(biome == BiomeType.Grassland){
                b = new GrasslandBiome(this._scene, this._mapData);
            } else {
                b = new SandlandBiome(this._scene, this._mapData);
            }
            this.biomes.push(b);
            b.createBiome(xChunk, biomeSizes);

        }
    }

    addImages(){
        this._mapData.landGenerator.landData.forEach((row, y) => {
            row.forEach((land, x) => {
                this.addVines(land, x, y);
                this.addGrass(land, x, y);
                this.addMushrooms(land, x, y);
                this.addSandSurface(land, x, y);
            })
        })
    }


    addVines(land: LandData, x: integer, y: integer){
        if(y > 0){
            let aboveTile = this._mapData.landGenerator.landData[y - 1][x];
            if((land.ruleTile == RuleTile.top || land.ruleTile == RuleTile.topLeft || land.ruleTile == RuleTile.topRight) && land.landType == LandTypes.Normal && aboveTile.landType == LandTypes.Hole){
                let indeces = BiomeTileSets.testSet.get(BiomeTiles.Vines)
                let index = indeces[Math.floor(Math.random()*indeces.length)]
                land.biome = this._scene.add.image(Game_Config.MAP_tilesToWorld(land.pos.x), Game_Config.MAP_tilesToWorld(land.pos.y), 'plantTilesSpriteSheet', index)
                    .setOrigin(0)
                    .setDepth(5)
                    .setScale(Game_Config.MAP_SCALE);
            }
        }
    }

    addGrass(land: LandData, x: integer, y: integer){
        if(y > 0){
            let aboveTile = this._mapData.landGenerator.landData[y - 1][x];
            if((land.ruleTile == RuleTile.top || land.ruleTile == RuleTile.topLeft || land.ruleTile == RuleTile.topRight) && land.landType == LandTypes.Normal && aboveTile.landType == LandTypes.None){
                let indeces = BiomeTileSets.testSet.get(BiomeTiles.Grassland)
                let index = indeces[Math.floor(Math.random()*indeces.length)]
                land.biome = this._scene.add.image(Game_Config.MAP_tilesToWorld(land.pos.x), Game_Config.MAP_tilesToWorld(land.pos.y - 1), 'plantTilesSpriteSheet', index)
                    .setOrigin(0)
                    .setDepth(5)
                    .setScale(Game_Config.MAP_SCALE)
                    // .setPipeline('Light2D');
            }
        }
    }

    addMushrooms(land: LandData, x: integer, y: integer){
        if(y > 0){
            let rand = Math.random();
            let aboveTile = this._mapData.landGenerator.landData[y - 1][x];
            if((land.ruleTile == RuleTile.top || land.ruleTile == RuleTile.topLeft || land.ruleTile == RuleTile.topRight) && land.landType == LandTypes.Normal && aboveTile.landType == LandTypes.Hole && rand < 0.2){
                let indeces = BiomeTileSets.testSet.get(BiomeTiles.Mushrooms)
                let index = indeces[Math.floor(Math.random()*indeces.length)]
                land.biome = this._scene.add.image(Game_Config.MAP_tilesToWorld(land.pos.x), Game_Config.MAP_tilesToWorld(land.pos.y - 1), 'plantTilesSpriteSheet', index)
                    .setOrigin(0)
                    .setDepth(5)
                    .setScale(Game_Config.MAP_SCALE);
            }
        }
    }

    addSandSurface(land: LandData, x: integer, y: integer){
        if(y > 0){
            let aboveTile = this._mapData.landGenerator.landData[y - 1][x];
            if((land.ruleTile == RuleTile.top || land.ruleTile == RuleTile.topLeft || land.ruleTile == RuleTile.topRight) && land.landType == LandTypes.Sandy && aboveTile.landType == LandTypes.None){
                let indeces = BiomeTileSets.testSet.get(BiomeTiles.SandSurface)
                let index = indeces[Math.floor(Math.random()*indeces.length)]
                land.biome = this._scene.add.image(Game_Config.MAP_tilesToWorld(land.pos.x), Game_Config.MAP_tilesToWorld(land.pos.y - 1), 'plantTilesSpriteSheet', index)
                    .setOrigin(0)
                    .setDepth(5)
                    .setScale(Game_Config.MAP_SCALE);
            }
        }
    }



}