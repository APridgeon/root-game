import PlantData, { Position } from "../plant/plantData";
import { RootData } from "../player/userInput";
import 'phaser';

export default class aiController {

    scene: Phaser.Scene;
    plant: PlantData;

    constructor(scene: Phaser.Scene, plant: PlantData){

        this.plant = plant;
        this.scene = scene;


    }

    public aiRootChoice(){
        let chosenPos: Position;
        let finalPos: Position;

        this.plant.__rootData.forEach(pos => {

            let N = {x: pos.x, y: pos.y - 1};
            let E = {x: pos.x + 1, y: pos.y};
            let S = {x: pos.x, y: pos.y + 1};
            let W = {x: pos.x - 1, y: pos.y};

            let rand = Math.random();
            if(rand < 0.1){
                chosenPos = N;
            }
            else if(rand < 0.2){
                chosenPos = E;
            }
            else if(rand < 0.9){
                chosenPos = S;
            }
            else if(rand <= 1){
                chosenPos = W;
            }

            rand = Math.random()
            let threshold = (1/(this.plant.__rootData.length)) * (0.5 * this.plant.__rootData.length);
            if(rand > threshold){
                finalPos = chosenPos;
            }
        })

        if(!finalPos){
            finalPos = chosenPos;
        }

        let rootData: RootData = {
            coords: chosenPos,
            plant: this.plant
        }

        this.scene.events.emit('rootGrowthRequest', rootData);

    }


}