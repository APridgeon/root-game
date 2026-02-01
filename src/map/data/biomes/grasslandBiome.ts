import Game_Config from "../../../game_config";
import { BiomeTiles, BiomeTileSets, BiomeType } from "../biomeManager";
import LandData from "../landData";
import { LandTypes } from "../landGenerator";
import { BiomeBase } from "./biomeInterface";

/**
 * Concrete implementation of the Grassland Biome.
 * Features sprawling grass, hanging vines in caves, and phosphorous mineral pockets.
 */
export default class GrasslandBiome extends BiomeBase {
    public biomeType: BiomeType = BiomeType.Grassland;
    public landType: LandTypes = LandTypes.Normal;

    /**
     * Distributes water based on simplex noise, restricted to tiles below ground level.
     */
    public override addWater(): void {
        const noise = this.mapData.noise;
        const groundLevel = Game_Config.MAP_GROUND_LEVEL;
        const waterAmount = Game_Config.WATER_TILE_STARTING_AMOUNT;

        for (const land of this.landData) {
            if (land.pos.y > groundLevel && land.isLand()) {
                // Offset noise to differentiate from mineral distribution
                const noiseVal = noise.simplex2(land.pos.x * 0.05 + 0.3, land.pos.y * 0.05 + 0.3);
                
                land.water = noiseVal > 0.3 ? waterAmount : 0;
                land.phosphorous = false;
            }
        }
    }

    /**
     * Scans biome tiles to place decorative elements (vines, grass, mushrooms).
     */
    public override addImages(): void {
        const landGrid = this.mapData.landGenerator.landData;

        for (const land of this.landData) {
            const { x, y } = land.pos;
            if (y <= 0) continue;

            const aboveTile = landGrid[y - 1][x];
            if (!aboveTile) continue;

            // Attempt to decorate based on surrounding context
            this.tryAddingVines(land, aboveTile);
            this.tryAddingGrass(land, aboveTile);
            this.tryAddingMushrooms(land, aboveTile);
        }
    }

    /**
     * Generates phosphorous mineral veins using simplex noise.
     */
    public override addMinerals(): void {
        const noise = this.mapData.noise;

        for (const land of this.landData) {
            if (land.isLand()) {
                const noiseVal = noise.simplex2(land.pos.x * 0.05, land.pos.y * 0.05);
                land.phosphorous = noiseVal > 0.5;
            }
        }
    }

    /**
     * Adds vines if the current tile is normal ground and the tile above is a hole (cave ceiling).
     */
    private tryAddingVines(land: LandData, aboveTile: LandData): void {
        if (land.landType === LandTypes.Normal && aboveTile.landType === LandTypes.Hole) {
            land.biomeIndex = {
                index: this.getRandomTileIndex(BiomeTiles.Vines),
                pos: { x: 0, y: 0 }
            };
        }
    }

    /**
     * Adds grass if the current tile is normal ground and there is empty space above.
     */
    private tryAddingGrass(land: LandData, aboveTile: LandData): void {
        if (land.landType === LandTypes.Normal && aboveTile.landType === LandTypes.None) {
            land.biomeIndex = {
                index: this.getRandomTileIndex(BiomeTiles.Grassland),
                pos: { x: 0, y: -1 }
            };
        }
    }

    /**
     * Adds mushrooms with a 20% rarity chance in cave-like environments.
     */
    private tryAddingMushrooms(land: LandData, aboveTile: LandData): void {
        if (
            land.landType === LandTypes.Normal && 
            aboveTile.landType === LandTypes.Hole && 
            Math.random() < 0.2
        ) {
            land.biomeIndex = {
                index: this.getRandomTileIndex(BiomeTiles.Mushrooms),
                pos: { x: 0, y: -1 }
            };
        }
    }

    /**
     * Helper to grab a random tile index from the BiomeTileSets.
     */
    private getRandomTileIndex(tileType: BiomeTiles): number {
        const indices = BiomeTileSets.testSet.get(tileType);
        if (!indices || indices.length === 0) return 0;
        return indices[Math.floor(Math.random() * indices.length)];
    }
}