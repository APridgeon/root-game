import * as Phaser from "phaser";
import Game_Config from "../game_config";
import PlantData, { Position } from "./plantData";
import PlantTileSets, { PlantTile } from "./plantTileSets";
import PlantManager from "./plantManager";
import { Tree, TreeSettings } from "./aerialTree";
import PixelatedFX from "./pixelatedShader";
import { Events } from "../events/events";
import gameManager from "../gameManager/gameManager";
import { TreeType } from "./aerialTreeTiles";
import Main from "../game";

export default class PlantDisplay {

    scene: Main;
    plantManager: PlantManager;

    plantTileMap: Phaser.Tilemaps.Tilemap;
    plantTileSet: Phaser.Tilemaps.Tileset;
    plantTileLayer: Phaser.Tilemaps.TilemapLayer;

    plantTrees: Map<PlantData, Tree> = new Map();
    graphicsObject: Phaser.GameObjects.Graphics;

    pixel: PixelatedFX;


    constructor(scene: Main, plantManager: PlantManager){
        this.scene = scene;
        this.plantManager = plantManager;

        this.setupTileMapLayers();
        this.setupGraphicsTree();
        this.updatePlantDisplay();

        this.addAerialTree(this.plantManager.userPlant, true);
        this.plantManager.aiPlants.forEach(aiplant => {
            this.addAerialTree(aiplant);
        })

        this.scene.game.events.on(Events.screenSizeChange, () => {
            this.graphicsObject.resetPostPipeline();
            this.graphicsObject.setPostPipeline(this.pixel);
            let post = this.graphicsObject.postPipelines[0] as PixelatedFX;
            let scale = Game_Config.MAP_SCALE;
            if(gameManager.mobile) scale *= 1.5;
            post.setup(scale - 2, {NE: 0.1, SE: 0.1, SW: 0, NW: 0});
        })
    }

    setupTileMapLayers(){
        this.plantTileMap = this.scene.make.tilemap({width: Game_Config.MAP_SIZE.x, height: Game_Config.MAP_SIZE.y, tileWidth: Game_Config.MAP_RES, tileHeight: Game_Config.MAP_RES});
        this.plantTileSet = this.plantTileMap.addTilesetImage('plantTiles', null, Game_Config.MAP_RES, Game_Config.MAP_RES, 0, 0);
        this.plantTileLayer = this.plantTileMap.createBlankLayer('plant', this.plantTileSet, -Game_Config.MAP_tilesToWorld(0), -Game_Config.MAP_tilesToWorld(0))
            .setOrigin(0,0)
            .setDepth(10)
            .setScale(Game_Config.MAP_SCALE)
            .setVisible(true);
    }

    setupGraphicsTree(){
        this.pixel = (this.scene.renderer as Phaser.Renderer.WebGL.WebGLRenderer).pipelines.getPostPipeline('PixelatedFX') as PixelatedFX;
        this.graphicsObject = this.scene.add.graphics({x:0, y:0});
        this.graphicsObject.setPostPipeline(this.pixel)//.setPipeline('Light2D');
        let post = this.graphicsObject.postPipelines[0] as PixelatedFX;
        let scale = Game_Config.MAP_SCALE;
        if(gameManager.mobile) scale *= 1.5;
        console.log(this.scene.cameras.main.zoom)
        
        post.setup(scale - 2, {NE: 0.1, SE: 0.1, SW: 0, NW: 0});
    }

    private addToTileIndexData(plantData: PlantData, plantTileSet: Map<PlantTile, integer>): void {
        if(plantData.alive){
            plantData.__rootData.forEach(pos => {
                const index = PlantTileSets.ConvertToTileIndex(pos.x, pos.y, plantData, plantTileSet);
                this.plantTileLayer.putTileAt(index, pos.x, pos.y)
            })
        } else {
            plantData.__rootData.forEach(pos => {
                this.plantTileLayer.putTileAt(-1, pos.x, pos.y)
            })
            plantData.__rootData = [];
        }
        
    }

    public updatePlantDisplay(): void {
        this.addToTileIndexData(this.plantManager.userPlant, PlantTileSets.rootSet1);
        this.plantManager.aiPlants.forEach(aiplant => {
            this.addToTileIndexData(aiplant, PlantTileSets.rootSet1);
        })
    }

    private addAerialTree(plantData: PlantData, user: boolean = false){

        let treeSettings: TreeSettings = {
            abilityToBranch: 1,
            branchDelay: 10,
            startLeafGrowth: Phaser.Math.Between(10, 20),
            growthAmount: Phaser.Math.RND.between(30,100)/100,
            internodeLength: 5,
            life: 0,
            lineWidth: 3,
            lineWidthDecrease: 0.995,
            newBranchesTerminateSooner: Phaser.Math.RND.between(20, 40),
            seed: Phaser.Math.RND.integer().toString(),
            wobbliness: Phaser.Math.Between(30, 80),
            color: Phaser.Display.Color.RandomRGB(),
            treeType: Phaser.Math.Between(0, 2) as TreeType
        }

        if(user){
            treeSettings.treeType = this.scene.playerData
        }

        let scale = Game_Config.MAP_SCALE;
        if(gameManager.mobile){
            scale *= 2;
        }

        const tree = new Tree({x: Game_Config.MAP_tilesToWorld(plantData.startPos.x) + (Game_Config.MAP_RES), y: Game_Config.MAP_tilesToWorld(plantData.startPos.y)}, treeSettings, this.graphicsObject, this.scene);
        this.plantTrees.set(plantData, tree);

        this.scene.input.keyboard.on('keydown-A', () => {
            console.log("increased width!")
            tree.buds.forEach(bud => {
                bud.growing = true;
            })
            treeSettings.lineWidth += 0.2
        })
            
    }

    public destroyAerialTree(plantData: PlantData){
        const tree = this.plantTrees.get(plantData);
        tree.clear();
    }
}
