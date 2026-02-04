import Game_Config from "../game_config";
import MapManager from "../map/mapManager";
import PlantData, { Position } from "./plantData";
import PlantDisplay from "./plantDisplay";
import WaterHandler from "./waterHandling";
import { Events } from "../events/events";
import { RootData } from "../player/userInput";
import { LandTypes } from "../map/data/landGenerator";
import { Direction } from "../general/direction";
import Main from "../game";

/**
 * Orchestrates the lifecycle, positioning, and state of all plants (player and AI) 
 * within the game world. 
 * * It handles root validation, plant destruction, and event coordination 
 * between the map and the plants.
 */
export default class PlantManager {
    /** Reference to the main game scene context. */
    public scene: Main;
    /** Reference to the map manager for tile and land data access. */
    public mapManager: MapManager;
    /** Handles the visual representation and rendering of plants. */
    public plantDisplay: PlantDisplay;

    /** The plant data controlled by the human player. */
    public userPlant: PlantData;
    /** A collection of AI-controlled plants currently active in the scene. */
    public aiPlants: PlantData[] = [];

    /** Flag indicating if the player plant has died and the game has ended. */
    public gameOver: boolean = false;

    /**
     * Initializes the PlantManager, sets up the player plant, 
     * populates AI plants, and initializes water handling.
     * * @param scene The main game instance.
     * @param mapManager The manager responsible for the game grid.
     */
    constructor(scene: Main, mapManager: MapManager) {
        this.scene = scene;
        this.mapManager = mapManager;

        // Find starting height for the player
        const startX = Game_Config.PLANT_STARTING_POSX;
        const plantHeight = this.findGroundHeight(startX);

        this.userPlant = new PlantData(scene, { x: startX, y: plantHeight }, false);
        this.mapManager.DestroyTile({ x: startX, y: plantHeight });

        this.PlacePlants(scene);
        this.plantDisplay = new PlantDisplay(scene, this);

        new WaterHandler(scene, mapManager);
        this.setupEventResponses();
    }

    /**
     * Scans vertically down the map at a specific X coordinate to find 
     * the first non-empty land tile.
     * * @param x The horizontal grid coordinate.
     * @returns The Y coordinate of the ground surface.
     * @internal
     */
    private findGroundHeight(x: number): number {
        for (let y = 0; y < Game_Config.MAP_SIZE.y; y++) {
            const tile = this.mapManager.mapData.landGenerator.landData[y][x];
            if (tile.landType !== LandTypes.None) return y;
        }
        return 0;
    }

    /**
     * Determines if a specific tile is adjacent to an existing root of a given plant.
     * * @param plantData The plant to check adjacency against.
     * @param tile The target coordinate to check.
     * @returns The direction from the root to the tile, or `Direction.None` if not adjacent.
     */
    public checkIfPlantIsClose(plantData: PlantData, tile: Position): Direction {
        const { x, y } = tile;

        for (const pos of plantData.rootData) {
            if (pos.x === x && pos.y - 1 === y) return Direction.North;
            if (pos.x + 1 === x && pos.y === y) return Direction.East;
            if (pos.x === x && pos.y + 1 === y) return Direction.South;
            if (pos.x - 1 === x && pos.y === y) return Direction.West;
        }

        return Direction.None;
    }

    /**
     * Finalizes the growth of a new root by pushing the pending location 
     * into the plant's root data array.
     * * @param plantData The plant receiving the new root.
     */
    public createNewRoot(plantData: PlantData): void {
        if (plantData.newRootLocation) {
            plantData.rootData.push(plantData.newRootLocation);
        }
    }

    /**
     * Iterates through all plants to check if their water levels have dropped below zero.
     * If a plant is out of water, it triggers the destruction sequence.
     * * @param scene The active Phaser scene.
     */
    public checkPlantWaterLevels(scene: Phaser.Scene): void {
        // Check player
        if (this.userPlant.water < 0) {
            this.destroyPlant(this.userPlant, scene);
        }
        
        // Check AI
        this.aiPlants.forEach(plant => {
            if (plant.water < 0) this.destroyPlant(plant, scene);
        });
    }

    /**
     * Handles the death of a plant. Clears data, updates visuals, and emits 
     * game-wide death events.
     * * @param plantData The plant to be removed.
     * @param scene The active Phaser scene.
     */
    public destroyPlant(plantData: PlantData, scene: Phaser.Scene): void {
        plantData.alive = false;
        this.plantDisplay.destroyAerialTree(plantData);

        scene.events.emit(Events.DeadRootToLand, plantData.rootData);
        this.plantDisplay.updatePlantDisplay();
        plantData.rootData = [];
        
        if (plantData === this.userPlant) {
            scene.events.emit(Events.GameOver);
        }
    }

    /**
     * Procedurally generates AI plants across the map surface, ensuring 
     * they do not spawn too close to the player.
     * * @param scene The main game instance.
     * @internal
     */
    private PlacePlants(scene: Main): void {
        for (let x = 1; x < Game_Config.MAP_SIZE.x - 1; x += 6) {
            const user_x = this.userPlant.startPos.x;
            
            const isNotNearPlayer = !(x > user_x - 3 && x < user_x + 3);
            
            if (isNotNearPlayer && Math.random() > 0.5) {
                let plantHeight = 0;
                
                for (let y = 0; y < Game_Config.MAP_SIZE.y; y++) {
                    if (this.mapManager.isLandTileAccessible({ x, y })) {
                        plantHeight = y;
                        break;
                    }
                }

                const aiPlant = new PlantData(scene, { x, y: plantHeight }, true);
                this.mapManager.DestroyTile({ x, y: plantHeight });
                this.aiPlants.push(aiPlant);
            }
        }
    }

    /**
     * Sets up listeners for global game events like root growth requests 
     * and game over states.
     * @internal
     */
    private setupEventResponses(): void {
        this.scene.events.on(Events.RootGrowthRequest, (rootData: RootData) => {
            const directionTowardsPlant = this.checkIfPlantIsClose(rootData.plant, rootData.coords);

            if (directionTowardsPlant !== Direction.None) {
                rootData.plant.newRootLocation = rootData.coords;
                rootData.plant.newRootDirection = directionTowardsPlant;
            } else {
                rootData.plant.newRootLocation = null;
                rootData.plant.newRootDirection = Direction.None;
            }
        });

        this.scene.events.on(Events.GameOver, () => {
            this.gameOver = true;
        });
    }
}