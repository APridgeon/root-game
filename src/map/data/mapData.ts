import Perlin from "phaser3-rex-plugins/plugins/perlin";
import Game_Config from "../../game_config";
import LandGenerator, { LandTypes } from "./landGenerator";
import { Position } from "../../plant/plantData";
import MapManager from "../mapManager";
import BiomeManager from "./biomeManager";


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

    }



}