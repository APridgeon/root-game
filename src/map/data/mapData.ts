import Perlin from 'phaser3-rex-plugins/plugins/perlin.js';
import Game_Config from "../../game_config";
import LandGenerator, { LandTypes } from "./landGenerator";
import { Position } from "../../plant/plantData";
import MapManager from "../mapManager";
import BiomeManager, { BiomeTiles, BiomeType } from "./biomeManager";
import LandData from "./landData";
import { AnimatedTile } from '../display/animatedTiles';



const perlin = new Perlin(Math.random());

const noise_amplitude = (position: Position, frequency: number, amplitude: number): number => {
    return Math.round(((perlin.simplex2((position.x+frequency)/Game_Config.MAP_SIZE.x, (position.y*frequency)/Game_Config.MAP_SIZE.y)+1)/2)*amplitude);
}

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

const grass_biome_config = {
    land_type: LandTypes.Normal,
    decoration: {
        surface: [BiomeTiles.Grassland],
        hole_surface: [BiomeTiles.Mushrooms],
        animations: [AnimatedTile.Worm]
    },
    surface: {
        noise_amplitude: 15,
        noise_frequency: 10
    },
    holes: {
        threshold: 0.55,
        frequency: {x: 5, y: 5},
        offset: {x: 0, y: 0}
    },
    water: {
        threshold: 0.55,
        frequency: {x: 2, y: 2},
        offset: {x: 0.2, y: 0.2}
    },
}

const sand_biome_config = {
    land_type: LandTypes.Sandy,
    decoration: {
        surface: [BiomeTiles.SandSurface],
        hole_surface: [BiomeTiles.SandSurface],
        animations: []
    },
    surface: {
        noise_amplitude: 10,
        noise_frequency: 10
    },
    holes: {
        threshold: 0.65,
        frequency: {x: 5, y: 5},
        offset: {x: 0, y: 0}
    },
    water: {
        threshold: 0.65,
        frequency: {x: 8, y: 8},
        offset: {x: 0.4, y: 0.4}
    }
}

const get_biome_config = new Map<BiomeType, Biome_config>([
    [BiomeType.Grassland, grass_biome_config],
    [BiomeType.Sandy, sand_biome_config]
])

export default class MapData {

    _mapManager: MapManager;

    landGenerator: LandGenerator;
    biomeManager: BiomeManager;
    noise: Perlin;

    constructor(noise: Perlin, mapManager: MapManager, scene: Phaser.Scene){

        this._mapManager = mapManager;
        this.noise = noise;

        this.landGenerator = new LandGenerator(this, this.noise);
        this.biomeManager = new BiomeManager(this, scene);

        scene.events.emit('map finished');

        const map = this.initialise_tilemap();
        this.set_biome(map);
        this.create_surface(map)
        console.log(map);
        

    }

    initialise_tilemap(): LandData[][] {
        const map_2d: LandData[][] = Array.from({ length: Game_Config.MAP_SIZE.y }, () => new Array(Game_Config.MAP_SIZE.x).fill({undefined}));
        map_2d.forEach((row, y) => row.forEach((tile, x, a) => {
            a[x] = new LandData(LandTypes.None, {x: x, y: y}, this)
        }))
        return map_2d
    };

    set_biome(map_2d: LandData[][]): void {
        const biome_choices = [BiomeType.Grassland, BiomeType.Sandy];
        const biome_size = 50;

        for(let biome_x=biome_size; biome_x<=Game_Config.MAP_SIZE.x; biome_x+=biome_size){
            const biome = biome_choices[Math.floor(Math.random()*biome_choices.length)];
            for(let y=0; y<Game_Config.MAP_SIZE.y; y++){
                const frequency = 3;
                const amplitude = 10;
                const wobble = noise_amplitude({x: biome_x, y: y}, frequency, amplitude);
                for(let x=biome_x-biome_size; x<biome_x+wobble; x++){
                    if(x<Game_Config.MAP_SIZE.x && map_2d[y][x].biomeType === undefined){
                        map_2d[y][x].biomeType = biome;
                    }
                }
            }
        }
    }

    create_surface(map_2d: LandData[][]): void {
        for(let x=0; x<Game_Config.MAP_SIZE.x; x++){
            const biome_config = get_biome_config.get(map_2d[0][x].biomeType as BiomeType) as Biome_config
            const land_wobble = noise_amplitude({x: x, y: 10}, biome_config.surface.noise_frequency, biome_config.surface.noise_amplitude);
    
            for(let y=Game_Config.MAP_GROUND_LEVEL+land_wobble; y<Game_Config.MAP_SIZE.y; y++){
                if(map_2d[y][x]){
                    map_2d[y][x].landType = get_biome_config.get(map_2d[y][x].biomeType as BiomeType)?.land_type;
                    map_2d[y][x].landStrength = 1;

                    console.log(get_biome_config.get(map_2d[y][x].biomeType as BiomeType)?.land_type)
                }
            }
        }
    }


}