import * as Phaser from "phaser";
import Game_Config from "../game_config";
import PlantData from "./plantData";
import PlantTileSets, { PlantTile } from "./plantTileSets";
import PlantManager from "./plantManager";
import PlantGrowthTiles from "./plantGrowthTiles";

export default class PlantDisplay {

    private _scene: Phaser.Scene;
    private _plantManager: PlantManager;

    private plantTileMap: Phaser.Tilemaps.Tilemap;
    private plantTileSet: Phaser.Tilemaps.Tileset;

    private _plantTileLayer: Phaser.Tilemaps.TilemapLayer;
    get plantTileLayer(){
        return this._plantTileLayer;
    }

    private plantTileData: number[][] =  [...Array(Game_Config.MAP_SIZE.y)].map(e => Array(Game_Config.MAP_SIZE.x).fill(-1));

    constructor(scene: Phaser.Scene, plantManager: PlantManager){

        this._scene = scene;
        this._plantManager = plantManager;

        this.plantTileMap = scene.make.tilemap({width: Game_Config.MAP_SIZE.x, height: Game_Config.MAP_SIZE.y, tileWidth: Game_Config.MAP_RES, tileHeight: Game_Config.MAP_RES});
        this.plantTileSet = this.plantTileMap.addTilesetImage('plantTiles', null, Game_Config.MAP_RES, Game_Config.MAP_RES, 0, 0);
        this._plantTileLayer = this.plantTileMap.createBlankLayer('plant', this.plantTileSet, -Game_Config.MAP_tilesToWorld(0), -Game_Config.MAP_tilesToWorld(0))
            .setOrigin(0,0)
            .setDepth(10)
            .setScale(Game_Config.MAP_SCALE)
            .setVisible(true);

        this.updatePlantDisplay();

    }

    private convertToRuleTileData(plantData: PlantData, plantTileSet: Map<PlantTile, integer>): number[][] {

        let tileIndexData = [...Array(Game_Config.MAP_SIZE.y)].map(e => Array(Game_Config.MAP_SIZE.x).fill(-1));

        tileIndexData = PlantGrowthTiles.AddToTileSet(plantData, tileIndexData);

        for(let x = 1; x < plantData.rootData[0].length - 1; x++){
            for(let y = Game_Config.MAP_GROUND_LEVEL; y < plantData.rootData.length - 1; y++){
                if(plantData.rootData[y][x]){
                    tileIndexData[y][x] = PlantTileSets.ConvertToTileIndex(x, y, plantData.rootData, plantTileSet);
                } 
            }
        }

        return tileIndexData;
    }

    private combineRuleTileData(preExistingPlantData: number[][], newPlantData: number[][]): number[][]{

        for(let x = 1; x < newPlantData[0].length - 1; x++){
            for(let y = 1; y < newPlantData.length - 1; y++){
                if(preExistingPlantData[y][x] === -1){
                    preExistingPlantData[y][x] = newPlantData[y][x];
                }
            }
        }

        return preExistingPlantData;
    }

    public updatePlantDisplay(){

        let userTiles = this.convertToRuleTileData(this._plantManager.userPlant, PlantTileSets.testSet);


        this._plantManager.aiPlants.forEach(aiplant => {
            let aiTiles = this.convertToRuleTileData(aiplant, PlantTileSets.testSet);
            this.plantTileData = this.combineRuleTileData(userTiles, aiTiles);
        })

        this._plantTileLayer
            .putTilesAt(this.plantTileData, 0, 0)

    }
}
