import Perlin from "phaser3-rex-plugins/plugins/perlin";
import MapData from "./mapData";
import Game_Config from "../../game_config";
import { LandTypes } from "./landGenerator";

class WaterGenerator {

    private _mapData: MapData;
    private _noise: Perlin;

    private size = Game_Config.MAP_SIZE;
    private waterLevel = Game_Config.MAP_RESOURCE_LEVEL;

    private noiseStretch = 0.09;
    private noiseThreshold = -0.5;

    private _waterData: boolean[][];
    private _waterAmount: number[][];

    private startingWaterAmount  = Game_Config.WATER_TILE_STARTING_AMOUNT;

    get waterData(){
        return this._waterData;
    }

    get waterAmount(){
        return this._waterAmount;
    }

    constructor(mapData: MapData, noise: Perlin){

        this._mapData = mapData;
        this._noise = noise;

        this.createWaterData();
        this.addSimplexNoise();
        this.addWaterAmount();

    }

    private createWaterData(): void {
        this._waterData = [...Array(this.size.y)].map(e => Array(this.size.x).fill(false));
    }

    private addSimplexNoise(): void {
        for(let x = 0; x < this.size.x; x++){
            for(let y = this.waterLevel; y < this.size.y; y++){
                if(this._mapData.landData2[y][x] !== LandTypes.Hole){
                    this._waterData[y][x] = (this._noise.simplex2(x * this.noiseStretch, y * this.noiseStretch)) < this.noiseThreshold; 
                }
            }
        }
    }

    private addWaterAmount(): void {
        this._waterAmount = [...Array(this.size.y)].map(e => Array(this.size.x).fill(0));

        for(let x = 0; x < this.size.x; x++){
            for(let y = 0; y < this.size.y; y++){
                if(this._waterData[y][x]){
                    this._waterAmount[y][x] =  this.startingWaterAmount;
                }
            }
        }
    }

}

export default WaterGenerator;