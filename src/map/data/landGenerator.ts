import Game_Config from "../../game_config";
import MapData from "./mapData";
import Perlin from "phaser3-rex-plugins/plugins/perlin";
import { Position } from "../../plant/plantData";
import LandData from "./landData";

import { Math as PhaserMath } from "phaser";

/**
 * Represents the available types of terrain tiles within the game world.
 */
export enum LandTypes {
    None = 'none',
    Normal = 'normal',
    Hole = 'hole',
    DeadRoot = 'deadroot',
    Sandy = 'sandy'
}

/**
 * The LandGenerator handles the procedural generation of the game map.
 * It utilizes Perlin noise to create organic ground levels and underground caverns.
 */
class LandGenerator {

    /** Reference to the global map data manager. */
    private _mapData: MapData;
    
    /** The noise generator used for terrain randomness. */
    private _noise: Perlin;

    /** 2D array containing the state and data for every tile in the map. */
    public landData: LandData[][];

    /** The dimensions of the map, retrieved from global config. */
    size = Game_Config.MAP_SIZE;

    /** The base Y-coordinate where the surface begins. */
    groundLevel = Game_Config.MAP_GROUND_LEVEL;

    /** The Y-coordinate depth where holes/caves begin to generate. */
    underGroundHoleLevel = Game_Config.MAP_UGROUND_HOLE_LEVEL;

    /** The Y-coordinate depth where sandy terrain begins. */
    sandLevel = Game_Config.MAP_UGROUND_HOLE_LEVEL + 10;

    /** Temporary storage for testing land configurations. */
    test_land_data: LandData[][];

    /** How much to stretch the noise for cavern generation. Smaller = larger features. */
    private readonly NOISE_STRETCH = 0.05;

    /** The cutoff value for noise; values above this become 'Holes'. */
    private readonly NOISE_THRESHOLD = 0.7;

    /** The maximum height variance (in tiles) for the surface terrain. */
    private readonly WOBBLE_AMP = 6;

    /** The horizontal frequency of the surface waves. */
    private readonly WOBBLE_FREQ = 0.03;

    /**
     * Creates an instance of LandGenerator and triggers the initial generation sequence.
     * @param mapData - The parent MapData instance.
     * @param noise - A RexPlugins Perlin noise instance.
     */
    constructor(mapData: MapData, noise: Perlin){
        this._mapData = mapData;
        this._noise = noise;

        this.landData = this.initializeGrid()
        this.generateBaseTerrain();
        this.applyNoiseOverlay({
            startY: this.underGroundHoleLevel,
            stretch: { x: this.NOISE_STRETCH, y: this.NOISE_STRETCH },
            threshold: this.NOISE_THRESHOLD
        })
    }

    /**
     * Creates an empty 2D array structure based on the map size.
     * @returns A pre-allocated 2D array (rows then columns).
     */
    private initializeGrid(): LandData[][] {
        return Array.from({ length: this.size.y }, () => new Array(this.size.x));
    }

    /**
     * Generates the basic "cake layer" of the world, distinguishing between
     * sky (None) and soil (Normal) using a simple 1D noise wobble for the surface.
     */
    private generateBaseTerrain(): void {
        for (let x = 0; x < this.size.x; x++) {
            // Calculate ground height once per column
            const noiseValue = this._noise.simplex2(x * this.WOBBLE_FREQ, 0.5);
            const groundOffset = PhaserMath.RoundTo(noiseValue * this.WOBBLE_AMP, 0);
            const currentGroundY = this.groundLevel + groundOffset;

            for (let y = 0; y < this.size.y; y++) {
                const type = y >= currentGroundY ? LandTypes.Normal : LandTypes.None;
                this.landData[y][x] = new LandData(type, { x, y }, this._mapData);
            }
        }
    }

    /**
     * Carves out holes or specialized terrain types in the existing land data
     * using a 2D noise overlay.
     * * @param config - Configuration for the noise pass.
     * @param config.startY - The depth at which to start applying the noise.
     * @param config.stretch - How much to scale the noise sampling.
     * @param config.threshold - The value (0-1) above which land is destroyed.
     */
    private applyNoiseOverlay(config: {
        startY: number, 
        stretch: Position, 
        threshold: number 
    }): void {
        const { startY, stretch, threshold } = config;

        for (let x = 0; x < this.size.x; x++) {
            for (let y = startY; y < this.size.y; y++) {
                const noiseVal = this._noise.simplex2(x * stretch.x, y * stretch.y);
                
                if (noiseVal > threshold) {
                    const land = this.landData[y][x];
                    land.destroy_data_only()
                }
            }
        }
    }

}

export default LandGenerator;