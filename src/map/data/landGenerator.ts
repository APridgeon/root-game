import { Game } from "phaser";
import Game_Config from "../../game_config";
import MapData from "./mapData";
import Perlin from "phaser3-rex-plugins/plugins/perlin";
import * as Phaser from "phaser";
import { Position } from "../../plant/plantData";
import LandData from "./landData";

import { Math as PhaserMath } from "phaser";

export enum LandTypes {
    None = 'none',
    Normal = 'normal',
    Hole = 'hole',
    DeadRoot = 'deadroot',
    Sandy = 'sandy'
}


class LandGenerator {

    private _mapData: MapData;
    private _noise: Perlin;

    public landData: LandData[][];

    size = Game_Config.MAP_SIZE;
    groundLevel = Game_Config.MAP_GROUND_LEVEL;
    underGroundHoleLevel = Game_Config.MAP_UGROUND_HOLE_LEVEL;
    sandLevel = Game_Config.MAP_UGROUND_HOLE_LEVEL + 10;

    test_land_data: LandData[][];

    private readonly NOISE_STRETCH = 0.05;
    private readonly NOISE_THRESHOLD = 0.7;
    private readonly WOBBLE_AMP = 6;
    private readonly WOBBLE_FREQ = 0.03;

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

    private initializeGrid(): LandData[][] {
        return Array.from({ length: this.size.y }, () => new Array(this.size.x));
    }

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