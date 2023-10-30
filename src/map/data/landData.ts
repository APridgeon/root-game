import { Position } from "../../plant/plantData";
import { LandTypes } from "./landGenerator";

class LandData {

    landType: LandTypes;
    landStrength: number = 0;
    pos?: Position;

    constructor(landType: LandTypes, pos?: Position){
        this.landType = landType;
        this.initStrength();

        if(pos){
            this.pos = pos;
        }
    }

    private initStrength() {
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

    public attack(): boolean {
        this.landStrength -= 1;
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

    private destroy(){
        this.landType = LandTypes.Hole;
        this.landStrength = 0;
    }

}

export default LandData;