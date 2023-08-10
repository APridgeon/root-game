import Perlin from "phaser3-rex-plugins/plugins/perlin";
import Game_Config from "../../game_config";
import { Position } from "../../plant/plantData";
import BodyOfWater from "./bodyOfWater";
import LandGenerator from "./landGenerator";
import WaterGenerator from "./waterGenerator";


export default class MapData {

    private _landGenerator: LandGenerator;

    get landData(){
        return this._landGenerator.landData;
    }

    private _waterGenerator: WaterGenerator;

    get waterData(){
        return this._waterGenerator.waterData;
    }

    get waterAmount(){
        return this._waterGenerator.waterAmount;
    }

    deadRootPos: boolean[][] = [...Array(Game_Config.MAP_SIZE)].map(e => Array(Game_Config.MAP_SIZE).fill(false));
    bodiesOfWater: BodyOfWater[] = [];
    noise: Perlin;

    constructor(noise: Perlin){

        this.noise = noise;

        this._landGenerator = new LandGenerator(this, this.noise);
        this._waterGenerator = new WaterGenerator(this, this.noise);

        console.log(this._waterGenerator.waterAmount);


        this.bodiesOfWater = this.identifyBodiesOfWater(this.waterData);

    }

    private identifyBodiesOfWater(waterData: boolean[][]): BodyOfWater[] {

        let bodyOfWater: BodyOfWater;
        let bodiesOfWater: BodyOfWater[] = [];

        let checkQueue: Position[] = [];

        // populate positions to check
        for(let x = 0; x < waterData[0].length; x++){
            for(let y = 0; y < waterData.length; y++){
                if(waterData[y][x]){
                    checkQueue.push({x: x, y: y})   
                }
            }
        }

        //start iterating though queue 
        while(checkQueue.length > 0){

            let parent = checkQueue.shift();
            
            // find initial positions connected to parent
            let parentQueue = this.checkConnections(parent, checkQueue, true)
            let connectedToParent = [];

            // iterate through positions connected to parent check for their connections, if true add to parent queue
            while(parentQueue.length > 0){
                let current = parentQueue.shift();
                connectedToParent.push(current);
                let currentConnections = this.checkConnections(current, checkQueue, true);
                currentConnections.forEach(pos => {
                    parentQueue.push(pos);
                })
            }

            connectedToParent.push(parent);

            bodyOfWater = new BodyOfWater(bodiesOfWater.length, connectedToParent, this);

            bodiesOfWater.push(bodyOfWater);

        }

        return bodiesOfWater;
    }

    private checkConnections(position: Position, checkQueue: Position[], removeFromCheckQueue: boolean): Position[] {

        let checkThese = [];
        let theseAreConnected = [];

        let N = {x: position.x, y: position.y - 1};
        checkThese.push(N);
        let E = {x: position.x + 1, y: position.y};
        checkThese.push(E);
        let S = {x: position.x, y: position.y + 1};
        checkThese.push(S);
        let W = {x: position.x - 1, y: position.y};
        checkThese.push(W);

        checkThese.forEach(pos => {
            let ind = checkQueue.findIndex(pos2 => pos.x === pos2.x && pos.y === pos2.y);
            if(ind > -1){
                theseAreConnected.push(pos);
                if(removeFromCheckQueue){
                    checkQueue.splice(ind, 1);
                }
            }

        })

        return theseAreConnected;

    }


}