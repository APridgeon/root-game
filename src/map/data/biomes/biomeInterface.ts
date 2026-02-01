import * as Phaser from "phaser";
import Game_Config from "../../../game_config";
import { BiomeType } from "../biomeManager";
import LandData from "../landData";
import { LandTypes } from "../landGenerator";
import MapData from "../mapData";

/**
 * Base class for all world biomes.
 * Provides the core logic for tile assignment, noise-based boundaries, and lifecycle hooks.
 * * @category Biomes
 */
export abstract class BiomeBase {
    /** The Phaser scene context for rendering biome-specific objects. */
    protected readonly scene: Phaser.Scene;
    
    /** Reference to the global map data and generation utilities. */
    protected readonly mapData: MapData;

    /** The unique identifier for this biome type. */
    public abstract biomeType: BiomeType;
    
    /** The default land type (texture/physics) associated with this biome. */
    public abstract landType: LandTypes;
    
    /** Collection of all tiles currently assigned to this biome instance. */
    public landData: LandData[] = [];

    /**
     * @param scene The current Phaser scene.
     * @param mapData The global map data container.
     */
    constructor(scene: Phaser.Scene, mapData: MapData) {
        this.scene = scene;
        this.mapData = mapData;
    }

    /**
     * Populates the biome across the map using a simplex noise wobble for organic edges.
     * * @param startX The horizontal starting coordinate.
     * @param biomeSize The width of the biome strip.
     */
    public createBiome(startX: number, biomeSize: number): void {
        const { y: mapHeight } = Game_Config.MAP_SIZE;
        const noise = this.mapData._mapManager.noise;

        for (let y = 0; y < mapHeight; y++) {
            // Calculate horizontal wobble using noise to prevent straight-line borders
            const wobble = noise.simplex2(0.5, y * 0.05);
            const xOffset = Phaser.Math.RoundTo(wobble * 5, 0) - 5;

            const rowStart = startX + xOffset;
            const rowEnd = startX + biomeSize - xOffset;

            for (let x = rowStart; x < rowEnd; x++) {
                this.assignTile(x, y);
            }
        }

        console.info(`Generated Biome: ${this.biomeType}`);
        
        this.addWater();
        this.addMinerals();
        this.addImages();
    }

    /**
     * Handles the logic for a single tile assignment, including cleanup and initialization.
     * * @param x The horizontal coordinate of the tile.
     * @param y The vertical coordinate of the tile.
     */
    private assignTile(x: number, y: number): void {
        const tile = this.mapData.landGenerator.landData[y]?.[x];
        
        if (!tile) return;

        // Clean up previous biome associations
        if (tile.biome)tile.removeFromBiome();

        // Assign new biome properties
        tile.biome = this;
        tile.biomeType = this.biomeType;
        this.landData.push(tile);

        if (tile.isLand()) {
            tile.landType = this.landType;
            tile.initStrength();
        }
    }

    /**
     * Hook to implement water bodies (lakes, rivers) specific to this biome.
     * @protected
     */
    protected addWater(): void {}

    /**
     * Hook to implement mineral deposits or resource nodes specific to this biome.
     * @protected
     */
    protected addMinerals(): void {}

    /**
     * Hook to handle decorative elements like trees, rocks, or flowers.
     * @protected
     */
    protected addImages(): void {}
}