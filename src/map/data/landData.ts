import PlantData, { Position } from "../../plant/plantData";
import { RuleTile } from "../display/ruleTileSets";
import { BiomeType } from "./biomeManager";
import { BiomeBase } from "./biomes/biomeInterface";
import { LandTypes } from "./landGenerator";
import MapData from "./mapData";
import * as Phaser from 'phaser';

class LandData {

    pos: Position;

    landType: LandTypes = LandTypes.None;
    biome_data: {
        biome_type: BiomeType,
    }
    //

    landStrength: number = 0;
    phosphorous: boolean = false;
    water: number = 0;

    biome: BiomeBase = undefined;
    biomeType: BiomeType;
    biomeIndex: {index: number, pos: Position} = {index: -1, pos: {x: 0, y: 0}};

    _mapData: MapData;

    constructor(landType: LandTypes, pos: Position, mapData: MapData){
        this.landType = landType;
        this.pos = pos;
        this._mapData = mapData;
        this.initStrength();
    }

    initStrength() {
        if(this.landType === LandTypes.Normal){
            this.landStrength = 1;
        } else if(this.landType === LandTypes.Sandy){
            this.landStrength = 0.5;
        } else if(this.landType === LandTypes.DeadRoot){
            this.landStrength = 2;
        } else {
            this.landStrength = 0;
        }
    }


    public attack(plant: PlantData): boolean {
        let effort = this.landStrength;
        this.landStrength -= plant.strength;
        plant.strength -= effort;
        if(this.landStrength <= 0){
            this.destroy();
            return true;
        } else {
            return false;
        }
    }

    public isLand(){
        if(this.landType !== LandTypes.Hole && this.landType !== LandTypes.None){
            return true;
        } else {
            return false;
        }
    }

    hasWater(){
        return (this.water > 0);
    }

    public destroy(){
        this.landType = LandTypes.Hole;
        this.landStrength = 0;
        this._mapData._mapManager.mapDisplay.tilemap_layers.get('decoration').putTileAt(-1, this.pos.x + this.biomeIndex.pos.x, this.pos.y + this.biomeIndex.pos.y);
        this.biomeIndex = {index: -1, pos: {x: 0, y: 0}}

        this._mapData._mapManager.mapDisplay.tilemap_layers.get('mineral').putTileAt(-1, this.pos.x, this.pos.y)
        this.phosphorous = false;
        this.water = 0;
    }

    removeFromBiome(){
        let index = this.biome.landData.findIndex(land => land.pos.x == this.pos.x && land.pos.y == this.pos.y);
        
        this.biome.landData.splice(index, 1);
        this.biome = undefined;
        this.biomeType = undefined;
        this.water = 0;
        this.phosphorous = false;
        this.biomeIndex = {index: -1, pos: {x: 0, y: 0}};
        this.landStrength = 0;
    }

}

export default LandData;