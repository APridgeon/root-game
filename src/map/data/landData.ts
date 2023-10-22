import { LandTypes } from "./landGenerator";

class LandData {

    landType: LandTypes;
    landStrength: number = 0;

    constructor(landType: LandTypes){
        this.landType = landType;
        this.initStrength();
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

}

export default LandData;