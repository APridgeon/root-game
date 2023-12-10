import * as Phaser from "phaser";
import Game_Config from "../game_config";
import PlantData, { Position } from "./plantData";
import PlantTileSets, { PlantTile } from "./plantTileSets";
import PlantManager from "./plantManager";
import PlantGrowthTiles from "./plantGrowthTiles";
import { Tree, TreeSettings } from "./aerialTree";
import PixelatedFX from "./pixelatedShader";
import { Events } from "../events/events";
import gameManager from "../gameManager/gameManager";

export default class PlantDisplay {

    private _scene: Phaser.Scene;
    private _plantManager: PlantManager;

    private plantTileMap: Phaser.Tilemaps.Tilemap;
    private plantTileSet: Phaser.Tilemaps.Tileset;
    private plantTrees: Map<PlantData, Tree> = new Map();

    private graphicsObject: Phaser.GameObjects.Graphics;

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


        let pixel = (this._scene.renderer as Phaser.Renderer.WebGL.WebGLRenderer).pipelines.getPostPipeline('PixelatedFX') as PixelatedFX;
        this.graphicsObject = this._scene.add.graphics({x: 0, y:0});
        this.graphicsObject.setPostPipeline(pixel);
        let post = this.graphicsObject.postPipelines[0] as PixelatedFX;

        let scale = Game_Config.MAP_SCALE;
        if(gameManager.mobile){
            scale *= 2;
        }

        post.setup(scale - 2, {NE: 0.1, SE: 0.1, SW: 0, NW: 0});

        this._scene.game.events.on(Events.screenSizeChange, () => {
            this.graphicsObject.resetPostPipeline();
            this.graphicsObject.setPostPipeline(pixel);
            let post = this.graphicsObject.postPipelines[0] as PixelatedFX;
            post.setup(scale - 2, {NE: 0.1, SE: 0.1, SW: 0, NW: 0});
        })

        this.updatePlantDisplay();

        
        this.addAerialTree(this._plantManager.userPlant);
        this._plantManager.aiPlants.forEach(aiplant => {
            this.addAerialTree(aiplant);
        })
    }

    private addToTileIndexData(plantData: PlantData, plantTileSet: Map<PlantTile, integer>): void {
        // PlantGrowthTiles.AddToTileSet(plantData, this.plantTileData);
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

    private addAerialTree(plantData: PlantData){

        let treeSettings: TreeSettings = {
            abilityToBranch: 2,
            branchDelay: 10,
            branchTermination: Phaser.Math.Between(10, 40),
            growthAmount: Phaser.Math.Between(0.7, 1.3),
            internodeLength: 1,
            life: 0,
            lineWidth: 2,
            lineWidthDecrease: 0.997,
            newBranchesTerminateSooner: 0,
            seed: Math.random().toString(),
            wobbliness: Phaser.Math.Between(30, 80)
        }

        let scale = Game_Config.MAP_SCALE;
        if(gameManager.mobile){
            scale *= 2;
        }

        let tree = new Tree({x: Game_Config.MAP_tilesToWorld(plantData.startPos.x) + (Game_Config.MAP_RES), y: Game_Config.MAP_tilesToWorld(plantData.startPos.y)}, treeSettings, this.graphicsObject, this._scene);
        this.plantTrees.set(plantData, tree);
    }

    public destroyAerialTree(plantData: PlantData){
        let tree = this.plantTrees.get(plantData);
        console.log(tree);
        tree.clear();
    }
}
