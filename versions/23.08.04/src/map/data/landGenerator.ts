import { Game } from "phaser";
import Game_Config from "../../game_config";
import MapData from "./mapData";
import Perlin from "phaser3-rex-plugins/plugins/perlin";

class LandGenerator {

    private _mapData: MapData;
    private _noise: Perlin;

    private _landData: boolean[][];

    readonly size = Game_Config.MAP_SIZE;
    readonly groundLevel = Game_Config.MAP_GROUND_LEVEL;
    readonly underGroundHoleLevel = Game_Config.MAP_UGROUND_HOLE_LEVEL;

    private noiseStretch = 0.05;
    private noiseThreshold = 0.7;


    get landData(){
        return this._landData;
    }

    constructor(mapData: MapData, noise: Perlin){

        this._mapData = mapData;
        this._noise = noise;

        this.createLandData();
        this.addSimplexNoise();

    }

    private createLandData(){
        this._landData = [...Array(Game_Config.MAP_SIZE)].map(e => Array(Game_Config.MAP_SIZE).fill(false));

        for(let x = 0; x < this.size; x++){
            for(let y = this.groundLevel; y < this.size; y++){
                this._landData[y][x] = true;
            }
        }
    }

    private addSimplexNoise(){

        for(let x = 0; x < this.size; x++){
            for(let y = this.underGroundHoleLevel; y < this.size; y++){
                this._landData[y][x] = ((this._noise.simplex2(x * this.noiseStretch, y * this.noiseStretch)) < this.noiseThreshold); 
            }
        }
    }

}

export default LandGenerator;