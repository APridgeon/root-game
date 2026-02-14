import * as Phaser from "phaser";
import { Events } from "../events/events";
import MapManager from "../map/mapManager";
import PlantData, { Position } from "../plant/plantData";
import PlantManager from "../plant/plantManager";
import { Direction, DirectionVectors } from "../general/direction";
import Game_Config from "../game_config";

/**
 * Manages the progression of game turns, coordinating root growth and 
 * resource management for both player and AI plants.
 */
export default class TurnHandler {
    private _scene: Phaser.Scene;
    private _plantManager: PlantManager;
    private _mapManager: MapManager;
    private _turnNo: number = 0;

    /**
     * Initializes the TurnHandler and sets up the listener for turn confirmation.
     * @param scene The main game scene.
     * @param plantManager The manager handling plant logic and state.
     * @param mapManager The manager handling tile and land data.
     */
    constructor(scene: Phaser.Scene, plantManager: PlantManager, mapManager: MapManager) {
        this._scene = scene;
        this._plantManager = plantManager;
        this._mapManager = mapManager;

        scene.scene.get('UI').events.on(Events.TurnConfirm, () => {
            this.processTurn();
        });
    }

    /**
     * Executes the logic for a single turn.
     * Coordinates player and AI growth, checks water levels, and updates the display.
     * @internal
     */
    private processTurn(): void {
        this.processPlantGrowth(this._plantManager.userPlant);

        this._plantManager.aiPlants.forEach(aiPlant => {
            if (aiPlant.alive && aiPlant.aiController) {
                aiPlant.aiController.aiRootChoice();
                this.processPlantGrowth(aiPlant);
            }
        });

        this._plantManager.checkPlantWaterLevels(this._scene);
        this._plantManager.plantDisplay.updatePlantDisplay();

        this._turnNo += 1;
        this._scene.events.emit(Events.UpdateUIText, this._turnNo);
    }

    /**
     * Handles the iterative root growth for a specific plant based on its strength.
     * @param plant The plant data to process growth for.
     * @internal
     */
    private processPlantGrowth(plant: PlantData): void {
        if (!plant.newRootLocation || !this._mapManager.isLandTileAccessible(plant.newRootLocation)) {
            this.finalizeGrowth(plant);
            return;
        }


        while (plant.strength > 0 && plant.newRootLocation) {
            const isDestroyed = this._mapManager.AttackTile(plant.newRootLocation, plant);
            
            if (isDestroyed) {
                this._plantManager.createNewRoot(plant);
                this._scene.events.emit(Events.RootGrowthSuccess, plant.newRootLocation);

                // Calculate next tile in the same direction

                const directionVector = DirectionVectors.vectors.get(plant.newRootDirection) as Position;
                const nextPos: Position = {
                    x: Phaser.Math.Clamp(plant.newRootLocation.x + directionVector.x, 0, Game_Config.MAP_SIZE.x - 1),
                    y: Phaser.Math.Clamp(plant.newRootLocation.y + directionVector.y, 0, Game_Config.MAP_SIZE.y - 1)
                };

                if (this._mapManager.isLandTileAccessible(nextPos)) {
                    plant.newRootLocation = nextPos;
                } else {
                    break;
                }
            } else {
                // Tile not destroyed yet, strength reduced by AttackTile
                break;
            }
        }

        this.finalizeGrowth(plant);
    }

    /**
     * Resets growth-related properties and triggers water absorption for a plant.
     * @param plant The plant data to finalize.
     * @internal
     */
    private finalizeGrowth(plant: PlantData): void {
        this._scene.events.emit(Events.AbsorbWater, plant);
        plant.newRootLocation = null;
        plant.newRootDirection = Direction.None;
        plant.strength = Game_Config.PLANT_STRENGTH;
    }
}