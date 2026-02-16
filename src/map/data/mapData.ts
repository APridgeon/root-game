import Perlin from 'phaser3-rex-plugins/plugins/perlin.js';
import Game_Config from "../../game_config";
import LandGenerator, { LandTypes } from "./landGenerator";
import { Position } from "../../plant/plantData";
import MapManager from "../mapManager";
import BiomeManager, { BiomeTiles, BiomeType } from "./biomeManager";
import LandData from "./landData";
import { AnimatedTile } from '../display/animatedTiles';

/** TYPES & CONFIGURATIONS **/

export type noise_frequency = {
    threshold: number,
    frequency: Position,
    offset: Position
}

export type Biome_config = {
    land_type: LandTypes,
    decoration: {
        surface: BiomeTiles[],
        hole_surface: BiomeTiles[],
        animations: AnimatedTile[]
    },
    surface: {
        noise_amplitude: number,
        noise_frequency: number
    },
    holes: noise_frequency,
    water: noise_frequency
}

const BIOME_CONFIGS: Record<BiomeType, Biome_config> = {
    [BiomeType.Grassland]: {
        land_type: LandTypes.Normal,
        decoration: {
            surface: [BiomeTiles.Grassland],
            hole_surface: [BiomeTiles.Mushrooms],
            animations: [AnimatedTile.Worm]
        },
        surface: { noise_amplitude: 15, noise_frequency: 10 },
        holes: { threshold: 0.55, frequency: { x: 5, y: 5 }, offset: { x: 0, y: 0 } },
        water: { threshold: 0.55, frequency: { x: 2, y: 2 }, offset: { x: 0.2, y: 0.2 } },
    },
    [BiomeType.Sandy]: {
        land_type: LandTypes.Sandy,
        decoration: {
            surface: [BiomeTiles.SandSurface],
            hole_surface: [BiomeTiles.SandSurface],
            animations: []
        },
        surface: { noise_amplitude: 10, noise_frequency: 10 },
        holes: { threshold: 0.65, frequency: { x: 5, y: 5 }, offset: { x: 0, y: 0 } },
        water: { threshold: 0.65, frequency: { x: 8, y: 8 }, offset: { x: 0.4, y: 0.4 } }
    }
};

/** MAIN CLASS **/

export default class MapData {
    _mapManager: MapManager;
    landGenerator: LandGenerator;
    biomeManager: BiomeManager;
    noise: Perlin;
    // grid: LandData[][];

    constructor(noise: Perlin, mapManager: MapManager, scene: Phaser.Scene) {
        this._mapManager = mapManager;
        this.noise = noise;

        this.landGenerator = new LandGenerator(this, this.noise);
        this.biomeManager = new BiomeManager(this, scene);

        // // 1. Initialize the 2D grid properly
        // this.grid = this.initialise_tilemap();
        
        // // 2. Determine Biome zones
        // this.set_biome(this.grid);
        
        // // 3. Carve out the surface/ground
        // this.create_surface(this.grid);

        scene.events.emit('map finished');
    }

    /**
     * Initializes a clean 2D array of LandData.
     * Fixed: Removed .fill() to prevent object reference sharing.
     */
    initialise_tilemap(): LandData[][] {
        return Array.from({ length: Game_Config.MAP_SIZE.y }, (_, y) =>
            Array.from({ length: Game_Config.MAP_SIZE.x }, (_, x) => 
                new LandData(LandTypes.None, { x, y }, this)
            )
        );
    }

    /**
     * Vertical-striping biome generation with Perlin "wobble" on the edges.
     */
    set_biome(map_2d: LandData[][]): void {
        const biome_choices = [BiomeType.Grassland, BiomeType.Sandy];
        const biome_size = 50;

        for (let biome_x = 0; biome_x < Game_Config.MAP_SIZE.x; biome_x += biome_size) {
            const biome = biome_choices[Math.floor(Math.random() * biome_choices.length)];
            
            for (let y = 0; y < Game_Config.MAP_SIZE.y; y++) {
                const wobble = this.get_noise_val({ x: biome_x, y }, 3, 10);
                const limit = biome_x + biome_size + wobble;

                for (let x = biome_x; x < limit && x < Game_Config.MAP_SIZE.x; x++) {
                    // Only assign if not already set by a previous overlapping wobble
                    if (map_2d[y][x].biomeType === undefined) {
                        map_2d[y][x].biomeType = biome;
                    }
                }
            }
        }
    }

    /**
     * Generates the ground level based on biome config noise settings.
     */
    create_surface(map_2d: LandData[][]): void {
        for (let x = 0; x < Game_Config.MAP_SIZE.x; x++) {
            // Use the biome assigned to the top of the column to determine surface height
            const currentBiome = map_2d[0][x].biomeType || BiomeType.Grassland;
            const config = BIOME_CONFIGS[currentBiome];

            const land_wobble = this.get_noise_val(
                { x, y: 10 }, 
                config.surface.noise_frequency, 
                config.surface.noise_amplitude
            );

            const groundY = Game_Config.MAP_GROUND_LEVEL + land_wobble;

            for (let y = groundY; y < Game_Config.MAP_SIZE.y; y++) {
                const tile = map_2d[y][x];
                const tileConfig = BIOME_CONFIGS[tile.biomeType] || config;

                tile.landType = tileConfig.land_type;
                tile.initStrength(); // Let LandData handle the strength math
            }
        }
    }

    /**
     * Helper to get a rounded, amplitude-scaled noise value.
     */
    private get_noise_val(pos: Position, freq: number, amp: number): number {
        const nx = (pos.x + freq) / Game_Config.MAP_SIZE.x;
        const ny = (pos.y * freq) / Game_Config.MAP_SIZE.y;
        const val = (this.noise.simplex2(nx, ny) + 1) / 2;
        return Math.round(val * amp);
    }
}