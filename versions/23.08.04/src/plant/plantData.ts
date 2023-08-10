import * as Phaser from "phaser";
import Game_Config from "../game_config"
import aiController from "../ai/aiPlantController";
import PlantGrowthTiles from "./plantGrowthTiles";
import plantGrowthTiles from "./plantGrowthTiles";

export type Position = {
    x: integer,
    y: integer
}

export enum PlantSize {
    Small = 0,
    Medium = 1,
    Large = 2
}

export enum PlantGrowthStage {
    Stage1 = 0,
    Stage2 = 1,
    Stage3 = 2,
    Stage4 = 3,
    Stage5 = 4,
    Stage6 = 5,
    Stage7 = 6,
    Stage8 = 7
}


export default class PlantData {

    private _scene: Phaser.Scene;

    private _startPos: Position;
    get startPos(){
        return this._startPos;
    }

    private _ai: boolean;
    get ai(){
        return this._ai;
    }

    private _rootData = [...Array(Game_Config.MAP_SIZE)].map(e => Array(Game_Config.MAP_SIZE).fill(false));
    get rootData(){
        return this._rootData;
    }

    public alive: boolean = true;
    public plantGrowthStage: PlantGrowthStage = PlantGrowthStage.Stage1;
    public plantGrowthType: plantGrowthTiles[] = PlantGrowthTiles.randomPlantType();
    public water: integer = Game_Config.WATER_START_LEVEL;
    public aiController: aiController | null;
    public newRootLocation: Position;


    constructor(scene: Phaser.Scene, startPos: Position, ai: boolean){

        this._scene = scene;
        this._startPos = startPos;
        this._ai = ai;

        this._rootData[this._startPos.y][this._startPos.x] = true;


        if(ai){
            this.aiController = new aiController(scene, this);
        }

    }

    public aerialGrowth(plantData: PlantData): void {
        if(plantData.plantGrowthStage !== PlantGrowthStage.Stage8){
            plantData.plantGrowthStage = (plantData.plantGrowthStage += 1 as PlantGrowthStage);
        }
    }

}