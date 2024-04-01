import PlantData, { Position } from "../../plant/plantData";
import { RuleTile } from "../display/ruleTileSets";
import { BiomeType } from "./biome";
import { LandTypes } from "./landGenerator";
import MapData from "./mapData";
import * as Phaser from 'phaser';

class LandData {

    pos: Position;

    landType: LandTypes;
    ruleTile: RuleTile;

    landStrength: number = 0;
    phosphorous: boolean;

    biomeType: BiomeType;
    biome: Phaser.GameObjects.Image;

    _mapData: MapData;

    constructor(landType: LandTypes, pos: Position, mapData: MapData){
        this.landType = landType;
        this.pos = pos;
        this._mapData = mapData;
        this.initStrength();
        this.initMinerals();

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

    initMinerals() {
        this.phosphorous = (this._mapData.noise.simplex2(this.pos.x * 0.1, this.pos.y * 0.1) > 0.5) && this.landType == LandTypes.Normal;
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

    public destroy(){
        this.landType = LandTypes.Hole;
        this.landStrength = 0;
        if(this.biome){
            this.biome.destroy();
        }
    }

}

export default LandData;