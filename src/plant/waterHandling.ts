import * as Phaser from "phaser";
import { Events } from "../events/events";
import MapManager from "../map/mapManager";
import PlantData, { Position } from "./plantData";
import Game_Config from "../game_config";

/**
 * Statistics regarding water flow for a specific plant update.
 */
export type WaterStats = {
    /** Amount of water gained from the environment. */
    waterAdded: number;
    /** Amount of water consumed or lost by the plant roots. */
    waterRemoved: number;
    /** The resulting total water level of the plant. */
    totalWater: number;
}

/**
 * Handles the logic for water absorption from the map tiles into plant entities.
 * * This class listens for global absorption events and updates both the 
 * {@link MapManager} and the individual {@link PlantData}.
 */
export default class WaterHandler {
    private _mapManager: MapManager;
    private _scene: Phaser.Scene;

    /**
     * Creates an instance of WaterHandler.
     * @param scene The Phaser scene context for event listening.
     * @param mapManager The manager handling the game world tiles.
     */
    constructor(scene: Phaser.Scene, mapManager: MapManager) {
        this._scene = scene;
        this._mapManager = mapManager;

        // Register the absorption listener
        this._scene.events.on(Events.AbsorbWater, this.handleWaterAbsorption, this);
        
        // Ensure cleanup to prevent memory leaks when the scene is swapped or restarted
        this._scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            this._scene.events.off(Events.AbsorbWater, this.handleWaterAbsorption, this);
        });
    }

    /**
     * Callback triggered when a plant attempts to absorb water.
     * Calculates nearby water, drains the tiles, and updates plant stats.
     * * @param plantData The data object of the plant performing the absorption.
     * @internal
     */
    private handleWaterAbsorption = (plantData: PlantData): void => {
        const waterSources = this.findNearbyWaterSources(plantData);
        
        // Process World Changes
        this.drainWaterSources(waterSources);

        // Process Plant Changes
        const waterAdded = waterSources.length * Game_Config.WATER_ADD_AMOUNT;
        const waterRemoved = plantData.rootData.length * Game_Config.WATER_SUBTRACT_AMOUNT;
        
        plantData.water += (waterAdded - waterRemoved);

        // Update UI/Feedback only if the plant belongs to a player
        if (!plantData.ai) {
            const stats: WaterStats = {
                waterAdded,
                waterRemoved,
                totalWater: plantData.water
            };
            this._scene.events.emit(Events.WaterText, stats);
        }
    }

    /**
     * Scans tiles adjacent to all plant roots to find available water.
     * * @param plantData The plant whose roots are being checked.
     * @returns A list of unique {@link Position} coordinates containing water.
     */
    private findNearbyWaterSources(plantData: PlantData): Position[] {
        const sources: Position[] = [];
        const landData = this._mapManager.mapData.landGenerator.landData;

        // Using a Set to avoid counting/draining the same water tile twice
        const uniqueKeys = new Set<string>();

        for (const { x, y } of plantData.rootData) {
            const neighbors = [
                { x, y: y - 1 }, { x: x + 1, y },
                { x, y: y + 1 }, { x: x - 1, y }
            ];

            for (const pos of neighbors) {
                const key = `${pos.x},${pos.y}`;
                if (uniqueKeys.has(key)) continue;

                const tile = landData[pos.y]?.[pos.x];
                if (tile && tile.water > 0) {
                    sources.push(pos);
                    uniqueKeys.add(key);
                }
            }
        }
        return sources;
    }

    /**
     * Reduces the water level of specified tiles and triggers a visual map update.
     * * @param sources Array of coordinates to be drained.
     */
    private drainWaterSources(sources: Position[]): void {
        const landData = this._mapManager.mapData.landGenerator.landData;
        
        for (const pos of sources) {
            const tile = landData[pos.y][pos.x];
            tile.water = Math.max(0, tile.water - 1);
            this._mapManager.mapDisplay.updateTile(pos);
        }
    }
}