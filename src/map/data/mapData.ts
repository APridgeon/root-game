import Perlin from "phaser3-rex-plugins/plugins/perlin";
import Game_Config from "../../game_config";
import LandGenerator from "./landGenerator";
import WaterGenerator from "./waterGenerator";


export default class MapData {

    private _landGenerator: LandGenerator;

    get landData(){
        return this._landGenerator.landData;
    }

    private _waterGenerator: WaterGenerator;

    get waterData(){
        return this._waterGenerator.waterData;
    }

    get waterAmount(){
        return this._waterGenerator.waterAmount;
    }

    deadRootPos: boolean[][] = [...Array(Game_Config.MAP_SIZE.y)].map(e => Array(Game_Config.MAP_SIZE.x).fill(false));
    noise: Perlin;

    constructor(noise: Perlin){

        this.noise = noise;

        this._landGenerator = new LandGenerator(this, this.noise);
        this._waterGenerator = new WaterGenerator(this, this.noise);

        console.log(this._waterGenerator.waterAmount);


    }

}