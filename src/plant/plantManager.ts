import Game_Config from "../game_config";
import MapManager from "../map/mapManager";
import PlantData, { Position } from "./plantData";
import PlantDisplay from "./plantDisplay";
import WaterHandler from "./waterHandling";
import { Events } from "../events/events";
import { RootData } from "../player/userInput";

export default class PlantManager {

    private _scene: Phaser.Scene;
    private _mapManager: MapManager;

    private _userPlant: PlantData;
    get userPlant(){
        return this._userPlant;
    }

    private _aiPlants: PlantData[] = [];
    get aiPlants(){
        return this._aiPlants;
    }

    private _plantDisplay: PlantDisplay;
    get plantDisplay(){
        return this._plantDisplay;
    }

    private _gameOver: boolean = false;
    get gameOver(){
        return this._gameOver;
    }

    constructor(scene: Phaser.Scene, mapManager: MapManager){

        this._scene = scene;
        this._mapManager = mapManager;

        this._userPlant = new PlantData(scene, {x: Game_Config.PLANT_STARTING_POSX, y: Game_Config.MAP_GROUND_LEVEL - 1}, false);

        this.PlacePlants(scene);
        this._plantDisplay = new PlantDisplay(scene, this);

        new WaterHandler(scene, mapManager);

        this.setupEventResponses();
    }

    public checkIfPlantIsClose(plantData: PlantData, tile: Position){


        let N = plantData.rootData[tile.y-1][tile.x];
        
        if(tile.y-1 === plantData.startPos.y && tile.x === plantData.startPos.x){
            N = true;
        }
        if(tile.y-1 === plantData.startPos.y && tile.x-1 === plantData.startPos.x){
            N = false;
        }
        if(tile.y-1 === plantData.startPos.y && tile.x+1 === plantData.startPos.x){
            N = false;
        }
        let S = plantData.rootData[tile.y+1][tile.x];
        let E = plantData.rootData[tile.y][tile.x+1];
        let W = plantData.rootData[tile.y][tile.x-1];

        // console.log('N: ' + N + ' E: ' + E + ' S: ' + S + ' W: ' + W);

        if(N || E || S || W){
            return true;
        } else {
            return false;
        }

    }

    public createNewRoot(plantData: PlantData, tileCoords: Position){
        plantData.rootData[tileCoords.y][tileCoords.x] = true;
    }

    public checkPlantWaterLevels(scene: Phaser.Scene){
        if(this._userPlant.water < 0){
            this.destroyPlant(this._userPlant, scene);

        };
        this._aiPlants.forEach(plant => {
            if(plant.water < 0){
                this.destroyPlant(plant, scene);
            }
        })
    }

    public destroyPlant(plantData: PlantData, scene: Phaser.Scene){
        
        plantData.alive = false;

        let deadRootPos: Position[] = [];

        plantData.rootData.forEach((row, y) => {
            row.forEach((pos, x) => {
                if(pos){
                    plantData.rootData[y][x] = false;
                    deadRootPos.push({x: x, y: y});
                }
            })
        });

        scene.events.emit(Events.DeadRootToLand, deadRootPos);

        if(plantData === this._userPlant){
            scene.events.emit(Events.GameOver);

        } else {
            // let index = this._aiPlants.findIndex(value => value === plantData);
            // this._aiPlants.splice(index, 1);
        }
    }

    private PlacePlants(scene: Phaser.Scene): void {
        for(let x = 1; x < Game_Config.MAP_SIZE.x - 1; x+=6){
            if(!(x > this._userPlant.startPos.x - 3 && x < this._userPlant.startPos.x + 3) && Math.random() > 0.5){
                let aiPlant = new PlantData(scene, {x: x, y: Game_Config.MAP_GROUND_LEVEL - 1}, true);
                this._aiPlants.push(aiPlant);
            }
        }
    }

    private setupEventResponses(): void{

        this._scene.events.on(Events.RootGrowthRequest, (rootData: RootData) => {

            let closeToPlant = this.checkIfPlantIsClose(rootData.plant, rootData.coords);
            let worldTileIsAccessable = this._mapManager.IsWorldTileAccessable(rootData.coords);


            if(closeToPlant && worldTileIsAccessable){

                rootData.plant.newRootLocation = rootData.coords;
                this._scene.events.emit(Events.RootGrowthSuccess, rootData.coords);
            }

        })

        this._scene.events.on(Events.AerialGrowth, (plantData: PlantData) => {
            plantData.aerialGrowth(plantData);
        });

        this._scene.events.on(Events.GameOver, () => {
            this._gameOver = true;
        })

    }


}

