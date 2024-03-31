import { Game } from "phaser";
import Game_Config from "../../game_config";
import MapData from "./mapData";
import Perlin from "phaser3-rex-plugins/plugins/perlin";
import * as Phaser from "phaser";
import { Position } from "../../plant/plantData";
import LandData from "./landData";

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

    landDataBeforeHoles: boolean[][] = [...Array(Game_Config.MAP_SIZE.y)].map(e => Array(Game_Config.MAP_SIZE.x).fill(false));

    public landData: LandData[][] = [...Array(Game_Config.MAP_SIZE.y)].map(e => Array(Game_Config.MAP_SIZE.x));

    readonly size = Game_Config.MAP_SIZE;
    readonly groundLevel = Game_Config.MAP_GROUND_LEVEL;
    readonly underGroundHoleLevel = Game_Config.MAP_UGROUND_HOLE_LEVEL;
    readonly sandLevel = Game_Config.MAP_UGROUND_HOLE_LEVEL + 10;

    private noiseStretch = 0.05;
    private noiseThreshold = 0.7;

    private landWobbleAmplitude = 6;
    private landWobbleFrequency = 0.03;



    constructor(mapData: MapData, noise: Perlin){

        this._mapData = mapData;
        this._noise = noise;

        this.createLandSurface();
        this.addSimplexNoise(this.underGroundHoleLevel, {x: this.noiseStretch, y: this.noiseStretch}, this.noiseThreshold, LandTypes.Hole);
        // this.addSimplexNoise(this.sandLevel, {x: this.noiseStretch * 0.5, y: this.noiseStretch * 0.5}, this.noiseThreshold - 0.3, LandTypes.Sandy, 0.5);



    }

    private createLandSurface(){

        for(let x = 0; x < this.size.x; x++){
            for(let y = 0; y < this.size.y; y++){
                this.landData[y][x] = new LandData(LandTypes.None, {x: x, y: y});
            }
        }

        for(let x = 0; x < this.size.x; x++){
            let noiseValue = this._noise.simplex2(x * this.landWobbleFrequency, 0.5 * this.landWobbleFrequency)
            let groundLevelAlt = Phaser.Math.RoundTo(noiseValue*this.landWobbleAmplitude, 0);

            for(let y = this.groundLevel + groundLevelAlt; y < this.size.y; y++){
                this.landDataBeforeHoles[y][x] = true;
                this.landData[y][x] = new LandData(LandTypes.Normal, {x: x, y: y});
            }

        }  
    }

    private addSimplexNoise(startFromY: number, noiseStretch: Position, noiseThreshold: number, landType: LandTypes, landStrength = 0){

        for(let x = 0; x < this.size.x; x++){
            for(let y = startFromY; y < this.size.y; y++){
                if((this._noise.simplex2(x * noiseStretch.x, y * noiseStretch.y)) > noiseThreshold){
                    this.landData[y][x] = new LandData(landType, {x: x, y: y});
                    this.landData[y][x].landStrength = landStrength;
                }
                
            }
        }
    }

}

export default LandGenerator;