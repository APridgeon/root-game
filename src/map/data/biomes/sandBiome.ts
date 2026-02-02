import Game_Config from "../../../game_config";
import { BiomeTiles, BiomeTileSets, BiomeType } from "../biomeManager";
import LandData from "../landData";
import { LandTypes } from "../landGenerator";
import { BiomeBase } from "./biomeInterface";

/**
 * Concrete implementation of a Desert/Sandy biome.
 * * This biome is characterized by sandy terrain, rare deep-water pockets,
 * and specific surface decorations (sand-ripples/dunes).
 * * @category Biomes
 */
export default class SandlandBiome extends BiomeBase {
    /** The unique identifier for the Sandy biome. */
    public biomeType: BiomeType = BiomeType.Sandy;
    
    /** The primary land type associated with this biome's terrain. */
    public landType: LandTypes = LandTypes.Sandy;

    /**
     * Generates rare, deep underground water pockets.
     * * Uses a Simplex noise threshold specifically tuned for desert scarcity.
     * Water only spawns significantly below the ground level to simulate deep aquifers.
     * * @override
     */
    public override addWater(): void {
        const { noise } = this.mapData;
        const groundLevelLimit = Game_Config.MAP_GROUND_LEVEL + 10;
        const waterAmount = Game_Config.WATER_TILE_STARTING_AMOUNT;

        for (const land of this.landData) {
            // Desert water is found much deeper than other biomes
            if (land.pos.y > groundLevelLimit && land.isLand()) {
                const waterNoise = noise.simplex2(land.pos.x * 0.05 + 0.3, land.pos.y * 0.05 + 0.3);
                
                // High threshold (0.7) ensures water is rare
                land.water = waterNoise > 0.7 ? waterAmount : 0;
                land.phosphorous = false;
            }
        }
    }

    /**
     * Scans biome tiles and applies surface-level sandy decorations.
     * * Iterates through all assigned tiles and checks for exposure to 'None' type tiles above.
     * * @override
     */
    public override addImages(): void {
        const landGrid = this.mapData.landGenerator.landData;

        for (const land of this.landData) {
            const { x, y } = land.pos;
            if (y <= 0) continue;

            const aboveTile = landGrid[y - 1]?.[x];
            if (aboveTile) {
                this.tryAddingSandSurface(land, aboveTile);
            }
        }
    }

    /**
     * Generates mineral deposits specific to the Sandy biome.
     * Currently serves as a placeholder for desert-specific resources like oil or gold.
     * * @override
     */
    public override addMinerals(): void {
        // Desert-specific mineral logic can be added here
    }

    /**
     * Determines if a tile is a candidate for a sand surface texture.
     * * Applies a random index from the SandSurface tileset if the tile is
     * sandy and the space above it is empty.
     * * @param land The tile data to potentially modify.
     * @param aboveTile The tile data directly above the target tile.
     * @private
     */
    private tryAddingSandSurface(land: LandData, aboveTile: LandData): void {
        if (land.landType === LandTypes.Sandy && aboveTile.landType === LandTypes.None) {
            const indices = BiomeTileSets.testSet.get(BiomeTiles.SandSurface);
            
            if (indices && indices.length > 0) {
                land.biomeIndex = { 
                    index: indices[Math.floor(Math.random() * indices.length)], 
                    pos: { x: 0, y: -1 } 
                };
            }
        }
    }
}