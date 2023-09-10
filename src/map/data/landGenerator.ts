import { Game } from "phaser";
import Game_Config from "../../game_config";
import MapData from "./mapData";
import Perlin from "phaser3-rex-plugins/plugins/perlin";
import * as Phaser from "phaser";
import { Position } from "../../plant/plantData";

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

    private _landData2: LandTypes[][] = [...Array(Game_Config.MAP_SIZE.y)].map(e => Array(Game_Config.MAP_SIZE.x).fill(LandTypes.None));
    private _landDataBeforeHoles: boolean[][] = [...Array(Game_Config.MAP_SIZE.y)].map(e => Array(Game_Config.MAP_SIZE.x).fill(false));

    private _landData: boolean[][];

    readonly size = Game_Config.MAP_SIZE;
    readonly groundLevel = Game_Config.MAP_GROUND_LEVEL;
    readonly underGroundHoleLevel = Game_Config.MAP_UGROUND_HOLE_LEVEL;

    private noiseStretch = 0.05;
    private noiseThreshold = 0.7;

    private landWobbleAmplitude = 6;
    private landWobbleFrequency = 0.03;


    get landData(){
        return this._landData;
    }

    get landData2(){
        return this._landData2;
    }

    get landDataBeforeHoles(){
        return this._landDataBeforeHoles;
    }

    constructor(mapData: MapData, noise: Perlin){

        this._mapData = mapData;
        this._noise = noise;

        this.createLandSurface();
        this.addSimplexNoise(this.underGroundHoleLevel, {x: this.noiseStretch, y: this.noiseStretch}, this.noiseThreshold, LandTypes.Hole);

    }

    private createLandSurface(){
        this._landData = [...Array(Game_Config.MAP_SIZE.y)].map(e => Array(Game_Config.MAP_SIZE.x).fill(false));

        for(let x = 0; x < this.size.x; x++){
            let noiseValue = this._noise.simplex2(x * this.landWobbleFrequency, 0.5 * this.landWobbleFrequency)
            let groundLevelAlt = Phaser.Math.RoundTo(noiseValue*this.landWobbleAmplitude, 0);

            for(let y = this.groundLevel + groundLevelAlt; y < this.size.y; y++){
                this._landData[y][x] = true;
                this._landDataBeforeHoles[y][x] = true;
                this._landData2[y][x] = LandTypes.Normal;
            }

        }  
    }

    private addSimplexNoise(startFromY: number, noiseStretch: Position, noiseThreshold: number, landType: LandTypes){

        for(let x = 0; x < this.size.x; x++){
            for(let y = startFromY; y < this.size.y; y++){
                this._landData[y][x] = ((this._noise.simplex2(x * noiseStretch.x, y * noiseStretch.y)) < noiseThreshold); 
                if((this._noise.simplex2(x * noiseStretch.x, y * noiseStretch.y)) > noiseThreshold){
                    this._landData2[y][x] = landType;
                }
                
            }
        }
    }

}

export default LandGenerator;