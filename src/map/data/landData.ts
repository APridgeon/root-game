import PlantData, { Position } from "../../plant/plantData";
import { RuleTile } from "../display/ruleTileSets";
import { BiomeType } from "./biomeManager";
import IBiome, { BiomeBase } from "./biomes/biomeInterface";
import { LandTypes } from "./landGenerator";
import MapData from "./mapData";
import * as Phaser from 'phaser';

class LandData {

    pos: Position;

    landType: LandTypes = LandTypes.None;
    ruleTile: RuleTile;

    landStrength: number = 0;
    phosphorous: boolean = false;

    biome: BiomeBase = undefined;
    biomeType: BiomeType;
    biomeIndex: {index: number, pos: Position} = {index: -1, pos: {x: 0, y: 0}};

    _mapData: MapData;

    constructor(landType: LandTypes, pos: Position, mapData: MapData){
        this.landType = landType;
        this.pos = pos;
        this._mapData = mapData;
        this.initStrength();
        // this.initMinerals();

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

    // TODO: this should really be the biome - fix this!
    initMinerals() {
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
        this._mapData._mapManager.mapDisplay.decorationLayer.putTileAt(-1, this.pos.x + this.biomeIndex.pos.x, this.pos.y + this.biomeIndex.pos.y);
        this.biomeIndex = {index: -1, pos: {x: 0, y: 0}}

        this._mapData._mapManager.mapDisplay.mineralLayer.putTileAt(-1, this.pos.x, this.pos.y)
        this.phosphorous = false;
    }

    removeFromBiome(){
        let index = this.biome.landData.findIndex(land => land.pos.x == this.pos.x && land.pos.y == this.pos.y);
        this.biome.landData.splice(index, 1);
    }

}

export default LandData;