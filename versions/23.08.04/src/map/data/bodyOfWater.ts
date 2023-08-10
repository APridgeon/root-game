import { Position } from "../../plant/plantData";
import MapData from "./mapData";
import * as Phaser from "phaser";

export default class BodyOfWater {

    name: number;
    positions: Position[];
    mapData: MapData;
    active: boolean = false;

    constructor(name: number, positions: Position[], mapData: MapData){

        this.name = name;
        this.positions = positions;
        this.mapData = mapData;

    }

    public chooseWaterTileToBeAffected(): Position {

        let chosenPosition: Position;

        this.positions.some( (pos, index) => {
            let neighbours = this.numberOfNeighbours(pos);
            let doAnyNeighboursOnlyConnectHere = this.neighbourSingletCheck(pos);
            if(neighbours < 4 && !doAnyNeighboursOnlyConnectHere){
                chosenPosition = pos;
                return true;
            } 
        })

        if(!chosenPosition){
            this.positions.some( (pos, index) => {
                let neighbours = this.numberOfNeighbours(pos);
                if(neighbours < 4){
                    chosenPosition = pos;
                    return true;
                } 
            })
        }

        return(chosenPosition);
    }

    public removeWaterTile(pos: Position): void{
        let index = this.positions.findIndex(val => {val == pos})
        this.positions.splice(index, 1);
    }

    public chooseWaterTileToBeAffected2(): Position {

        let chosenPosition: Position;

        this.positions.some( (pos, index) => {
            let neighbours = this.numberOfNeighbours(pos);
            let doAnyNeighboursOnlyConnectHere = this.neighbourSingletCheck(pos);
            if(neighbours < 4 && !doAnyNeighboursOnlyConnectHere){
                chosenPosition = pos;
                this.positions.splice(index, 1);
                return true;
            } 
        })

        if(!chosenPosition){
            this.positions.some( (pos, index) => {
                let neighbours = this.numberOfNeighbours(pos);
                if(neighbours < 4){
                    chosenPosition = pos;
                    this.positions.splice(index, 1);
                    return true;
                } 
            })
        }

        return(chosenPosition);

    }

    private numberOfNeighbours(pos: Position): integer{
        let N = this.positions.some(pos2 => pos.x === pos2.x && pos.y - 1 === pos2.y);
        let E = this.positions.some(pos2 => pos.x + 1 === pos2.x && pos.y === pos2.y);
        let S = this.positions.some(pos2 => pos.x === pos2.x && pos.y + 1 === pos2.y);
        let W = this.positions.some(pos2 => pos.x - 1 === pos2.x && pos.y === pos2.y);

        let neighbours = Number(N) + Number(E) + Number(S) + Number(W);

        return neighbours;
    }

    private neighbourSingletCheck(pos: Position): boolean{
        let N = {x: pos.x, y: pos.y - 1};
        let E = {x: pos.x + 1, y: pos.y};
        let S = {x: pos.x, y: pos.y + 1};
        let W = {x: pos.x - 1, y: pos.y};

        if(
            this.numberOfNeighbours(N) === 1 ||
            this.numberOfNeighbours(E) === 1 ||
            this.numberOfNeighbours(S) === 1 ||
            this.numberOfNeighbours(W) === 1
        ){
            return true
        }
        else { return false}

    }

    public checkIfWhole(pos: Position): Position[] {

        /*
        Loop through positions to see if they all connect
        starting position is passed in, closest to root
        return an array of positions that are not connected
        update the positions of the waterbody
        */

        let startPos: Position = pos;
        let currentlyChecking: Position[] = [];
        let connected: Position[] = [];
        currentlyChecking.push(startPos);

        while(currentlyChecking.length > 0){
            let curPos: Position = currentlyChecking.shift();
            this.positions.forEach(pos => {
                let dx = Math.abs(curPos.x - pos.x);
                let dy = Math.abs(curPos.y - pos.y);
                let distance = (dx + dy);
                if(
                    distance === 1 && 
                    !connected.some(conPos => conPos.x === pos.x && conPos.y === pos.y)
                ){
                    currentlyChecking.push(pos);
                    connected.push(pos);
                }

            })
        }

        let unincluded = this.positions.filter(x => !connected.includes(x));
        this.positions = connected;
        return unincluded;
    }

}