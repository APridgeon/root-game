import Perlin from "phaser3-rex-plugins/plugins/perlin";
import Game_Config from "../../game_config";
import LandGenerator, { LandTypes } from "./landGenerator";
import { Position } from "../../plant/plantData";
import MapManager from "../mapManager";
import BiomeManager from "./biomeManager";


export default class MapData {

    landGenerator: LandGenerator;
    _mapManager: MapManager;

    get landDataBeforeHoles(){
        return this.landGenerator.landDataBeforeHoles;
    }


    biomeManager: BiomeManager;

    deadRootPos: boolean[][] = [...Array(Game_Config.MAP_SIZE.y)].map(e => Array(Game_Config.MAP_SIZE.x).fill(false));
    noise: Perlin;

    constructor(noise: Perlin, mapManager: MapManager, scene: Phaser.Scene){

        this._mapManager = mapManager;
        this.noise = noise;

        this.landGenerator = new LandGenerator(this, this.noise);

        this.biomeManager = new BiomeManager(this, scene);



    }



}