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
        for(let y = 0; y < this.plant.rootData.length; y++){
            for(let x = 0; x < this.plant.rootData[0].length; x++){
                if(this.plant.rootData[y][x]){
                    let N = {x: x, y: y - 1};
                    let E = {x: x + 1, y: y};
                    let S = {x: x, y: y + 1};
                    let W = {x: x - 1, y: y};

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
                    let threshold = (1/(this.plant.rootData.flat(1).filter(Boolean).length)) * (0.5 * this.plant.rootData.flat(1).filter(Boolean).length);
                    if(rand > threshold){
                        break
                    }
                }
            }
        }

        let rootData: RootData = {
            coords: chosenPos,
            plant: this.plant
        }

        this.scene.events.emit('rootGrowthRequest', rootData);

    }


}