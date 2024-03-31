import PlantData, { Position } from "../../plant/plantData";
import { RuleTile } from "../display/ruleTileSets";
import { BiomeType } from "./biome";
import { LandTypes } from "./landGenerator";

class LandData {

    landType: LandTypes;
    landStrength: number = 0;
    pos?: Position;
    ruleTile?: RuleTile;
    biomeType: BiomeType;
    biome?: Phaser.GameObjects.Image;

    constructor(landType: LandTypes, pos?: Position){
        this.landType = landType;
        this.initStrength();

        if(pos){
            this.pos = pos;
        }
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

    public destroy(){
        this.landType = LandTypes.Hole;
        this.landStrength = 0;
        if(this.biome){
            this.biome.destroy();
        }
    }

}

export default LandData;