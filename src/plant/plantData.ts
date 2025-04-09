import * as Phaser from "phaser";
import Game_Config from "../game_config"
import aiController from "../ai/aiPlantController";
import { Direction } from "../general/direction";
import Main from "../game";


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

    private _scene: Main;

    startPos: Position;
    ai: boolean;

    __rootData: Position[] = [];

    alive: boolean = true;
    water: integer = Game_Config.PLANT_DATA_WATER_START_LEVEL;
    aiController: aiController | null;
    newRootLocation: Position;
    newRootDirection: Direction = Direction.None;

    strength: number = 1;


    constructor(scene: Main, startPos: Position, ai: boolean){

        this._scene = scene;
        this.startPos = startPos;
        this.ai = ai;

        this._scene.mapManager.AttackTile({x: this.startPos.x, y: this.startPos.y}, this);
        this.__rootData.push({x: this.startPos.x, y: this.startPos.y});

        if(ai) this.aiController = new aiController(scene, this);

    }

}