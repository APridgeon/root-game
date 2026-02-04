import * as Phaser from "phaser";
import Game_Config from "../game_config";
import PlantData from "./plantData";
import PlantTileSets, { PlantTile } from "./plantTileSets";
import PlantManager from "./plantManager";
import { Tree, TreeSettings } from "./aerialTree";
import PixelatedFX from "./pixelatedShader";
import { Events } from "../events/events";
import gameManager from "../gameManager/gameManager";
import { TreeType } from "./aerialTreeTiles";
import Main from "../game";

/**
 * Handles the visual representation of plants in the game world.
 * This class manages the tilemap layers for roots and the procedural 
 * generation of aerial tree structures using graphics pipelines.
 */
export default class PlantDisplay {
    /** Reference to the main game scene. */
    private scene: Main;
    
    /** Reference to the logic-side plant manager. */
    private plantManager: PlantManager;
    
    /** The tilemap instance used specifically for rendering plant growth. */
    private plantTileMap: Phaser.Tilemaps.Tilemap;
    
    /** The tileset assigned to the plant tilemap. */
    private plantTileSet: Phaser.Tilemaps.Tileset;
    
    /** The specific layer where root tiles are drawn. */
    public plantTileLayer: Phaser.Tilemaps.TilemapLayer;
    
    /** * A map linking plant logic data to their corresponding visual Tree objects.
     */
    public plantTrees: Map<PlantData, Tree> = new Map();
    
    /** The graphics object used to draw procedural tree branches. */
    private graphicsObject: Phaser.GameObjects.Graphics;
    
    /** The post-processing shader used to give the trees a pixelated aesthetic. */
    private pixelShader: PixelatedFX;

    /**
     * Creates an instance of PlantDisplay.
     * @param scene The Phaser scene context.
     * @param plantManager The manager handling plant logic and data.
     */
    constructor(scene: Main, plantManager: PlantManager) {
        this.scene = scene;
        this.plantManager = plantManager;

        this.setupTileMapLayers();
        this.setupGraphicsPipeline();
        
        // Initial setup
        this.syncAllPlants();
        this.initEventListeners();
    }

    /**
     * Initializes the tilemap and layers required for rendering roots.
     * Configures scale, depth, and positioning based on global game configuration.
     */
    private setupTileMapLayers(): void {
        const { x, y } = Game_Config.MAP_SIZE;
        const res = Game_Config.MAP_RES;
        const offset = -Game_Config.MAP_tilesToWorld(0);

        this.plantTileMap = this.scene.make.tilemap({ width: x, height: y, tileWidth: res, tileHeight: res });
        this.plantTileSet = this.plantTileMap.addTilesetImage('plantTiles', null, res, res, 0, 0);
        
        this.plantTileLayer = this.plantTileMap.createBlankLayer('plant', this.plantTileSet, offset, offset)
            .setOrigin(0, 0)
            .setDepth(10)
            .setScale(Game_Config.MAP_SCALE)
            .setVisible(true);
    }

    /**
     * Sets up the WebGL graphics pipeline and attaches the PixelatedFX shader.
     */
    private setupGraphicsPipeline(): void {
        const renderer = this.scene.renderer as Phaser.Renderer.WebGL.WebGLRenderer;
        this.pixelShader = renderer.pipelines.getPostPipeline('PixelatedFX') as PixelatedFX;
        
        this.graphicsObject = this.scene.add.graphics({ x: 0, y: 0 });
        this.applyShaderSettings();
    }

    /**
     * Updates shader parameters. Adjusts pixelation scale based on device type (mobile vs desktop).
     */
    private applyShaderSettings(): void {
        this.graphicsObject.resetPostPipeline();
        this.graphicsObject.setPostPipeline(this.pixelShader);
        const post = this.graphicsObject.postPipelines[0] as PixelatedFX;
        
        let scale = Game_Config.MAP_SCALE;
        if (gameManager.mobile) scale *= 1.5;

        // Apply specific pixelation parameters
        post.setup(scale - 2, { NE: 0.1, SE: 0.1, SW: 0, NW: 0 });
    }

    /**
     * Sets up global event listeners, such as responding to window resizing.
     */
    private initEventListeners(): void {
        this.scene.game.events.on(Events.screenSizeChange, () => this.applyShaderSettings());
    }

    /**
     * Synchronizes the tile data and creates initial tree visuals for both player and AI.
     */
    private syncAllPlants(): void {
        this.updatePlantDisplay();

        // Create tree for user
        this.addAerialTree(this.plantManager.userPlant, true);

        // Create trees for AI
        for (const aiPlant of this.plantManager.aiPlants) {
            this.addAerialTree(aiPlant);
        }
    }

    /**
     * Iterates through all plants and refreshes their tile indices on the tilemap.
     */
    public updatePlantDisplay(): void {
        const allPlants = [this.plantManager.userPlant, ...this.plantManager.aiPlants];
        for (const plant of allPlants) {
            this.updateTileIndices(plant, PlantTileSets.rootSet1);
        }
    }

    /**
     * Updates specific tiles for a plant. If the plant is dead, tiles are cleared.
     * @param plantData The data model of the plant.
     * @param tileSet The mapping used to determine which tile index to draw.
     */
    private updateTileIndices(plantData: PlantData, tileSet: Map<PlantTile, number>): void {
        if (!plantData.alive) {
            plantData.rootData.forEach(pos => this.plantTileLayer.putTileAt(-1, pos.x, pos.y));
            plantData.rootData = [];
            return;
        }

        plantData.rootData.forEach(pos => {
            const index = PlantTileSets.ConvertToTileIndex(pos.x, pos.y, plantData, tileSet);
            this.plantTileLayer.putTileAt(index, pos.x, pos.y);
        });
    }

    /**
     * Instantiates a new procedural Tree object based on plant data.
     * @param plantData Logic data for the plant.
     * @param isUser Whether this tree belongs to the player (enables debug keys).
     */
    private addAerialTree(plantData: PlantData, isUser: boolean = false): void {
        const settings = this.generateTreeSettings(isUser);
        
        const worldPos = {
            x: Game_Config.MAP_tilesToWorld(plantData.startPos.x) + Game_Config.MAP_RES,
            y: Game_Config.MAP_tilesToWorld(plantData.startPos.y)
        };

        const tree = new Tree(worldPos, settings, this.graphicsObject, this.scene);
        this.plantTrees.set(plantData, tree);

        // Debug/Interactive growth key
        if (isUser) {
            this.scene.input.keyboard.on('keydown-A', () => {
                tree.buds.forEach(bud => bud.growing = true);
                settings.lineWidth += 0.2;
            });
        }
    }

    /**
     * Randomizes and returns configuration settings for a new Tree.
     * @param isUser Determines if the tree uses player-specific data or random AI types.
     * @returns A complete TreeSettings object.
     */
    private generateTreeSettings(isUser: boolean): TreeSettings {
        return {
            abilityToBranch: 1,
            branchDelay: 10,
            startLeafGrowth: Phaser.Math.Between(10, 20),
            growthAmount: Phaser.Math.RND.realInRange(0.3, 1.0),
            internodeLength: 5,
            life: 0,
            lineWidth: 3,
            lineWidthDecrease: 0.995,
            newBranchesTerminateSooner: Phaser.Math.RND.between(20, 40),
            seed: Phaser.Math.RND.integer().toString(),
            wobbliness: Phaser.Math.Between(30, 80),
            color: Phaser.Display.Color.RandomRGB(),
            treeType: isUser ? (this.scene as any).playerData : (Phaser.Math.Between(0, 2) as TreeType)
        };
    }

    /**
     * Removes a tree's visuals and deletes it from the tracking map.
     * @param plantData The plant data associated with the tree to be destroyed.
     */
    public destroyAerialTree(plantData: PlantData): void {
        const tree = this.plantTrees.get(plantData);
        if (tree) {
            tree.clear();
            this.plantTrees.delete(plantData);
        }
    }
}