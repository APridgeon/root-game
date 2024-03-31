import Perlin from "phaser3-rex-plugins/plugins/perlin";
import Game_Config from "../../game_config";
import LandGenerator, { LandTypes } from "./landGenerator";
import WaterGenerator from "./waterGenerator";
import { Position } from "../../plant/plantData";
import MapManager from "../mapManager";
import Biome from "./biome";


export default class MapData {

    landGenerator: LandGenerator;
    _mapManager: MapManager;

    get landDataBeforeHoles(){
        return this.landGenerator.landDataBeforeHoles;
    }

    private _waterGenerator: WaterGenerator;

    get waterData(){
        return this._waterGenerator.waterData;
    }

    get waterAmount(){
        return this._waterGenerator.waterAmount;
    }

    biome: Biome;

    deadRootPos: boolean[][] = [...Array(Game_Config.MAP_SIZE.y)].map(e => Array(Game_Config.MAP_SIZE.x).fill(false));
    noise: Perlin;

    constructor(noise: Perlin, mapManager: MapManager, scene: Phaser.Scene){

        this._mapManager = mapManager;
        this.noise = noise;

        this.landGenerator = new LandGenerator(this, this.noise);
        this._waterGenerator = new WaterGenerator(this, this.noise);

        this.biome = new Biome(this, scene);



    }



}