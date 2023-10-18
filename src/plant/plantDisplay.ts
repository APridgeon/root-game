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

    private addToTileIndexData(plantData: PlantData, plantTileSet: Map<PlantTile, integer>): void {
        PlantGrowthTiles.AddToTileSet(plantData, this.plantTileData);
        plantData.__rootData.forEach(pos => {
            this.plantTileData[pos.y][pos.x] = PlantTileSets.ConvertToTileIndex(pos.x, pos.y, plantData, plantTileSet);
        })
    }

    public updatePlantDisplay(): void {

        this.plantTileData = [...Array(Game_Config.MAP_SIZE.y)].map(e => Array(Game_Config.MAP_SIZE.x).fill(-1));

        this.addToTileIndexData(this._plantManager.userPlant, PlantTileSets.rootSet1);
        this._plantManager.aiPlants.forEach(aiplant => {
            this.addToTileIndexData(aiplant, PlantTileSets.rootSet1);
        })

        this._plantTileLayer
            .putTilesAt(this.plantTileData, 0, 0)

    }
}
