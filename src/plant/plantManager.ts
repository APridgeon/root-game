import Game_Config from "../game_config";
import MapManager from "../map/mapManager";
import PlantData, { Position } from "./plantData";
import PlantDisplay from "./plantDisplay";
import WaterHandler from "./waterHandling";
import { Events } from "../events/events";
import { RootData } from "../player/userInput";
import { LandTypes } from "../map/data/landGenerator";
import { Direction } from "../general/direction";


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

        let plantHeight: number;

        for(let y = 0; y < Game_Config.MAP_SIZE.y; y++){
            if(this._mapManager.mapData._landGenerator.landData[y][Game_Config.PLANT_STARTING_POSX].landType !== LandTypes.None){
                plantHeight = y;
                break;
            }
        }
        this._userPlant = new PlantData(scene, {x: Game_Config.PLANT_STARTING_POSX, y: plantHeight }, false);
        this._mapManager.DestroyTile({x: Game_Config.PLANT_STARTING_POSX, y: plantHeight});

        this.PlacePlants(scene);
        this._plantDisplay = new PlantDisplay(scene, this);

        new WaterHandler(scene, mapManager);

        this.setupEventResponses();
    }

    public checkIfPlantIsClose(plantData: PlantData, tile: Position): Direction{

        let direction: Direction;

        let N = plantData.__rootData.some(val => {
            return ((val.x == tile.x) && ((val.y - 1) === (tile.y))) ? true : false;
        });

        let E = plantData.__rootData.some(val => {
            return ((val.x + 1 === tile.x) && ((val.y) === (tile.y))) ? true : false;
        });

        let S = plantData.__rootData.some(val => {
            return ((val.x === tile.x) && ((val.y + 1) === (tile.y))) ? true : false;
        });

        let W = plantData.__rootData.some(val => {
            return ((val.x - 1 === tile.x) && ((val.y) === (tile.y))) ? true : false;
        });

        if(N){
            direction = Direction.North;
        } else if (E){
            direction = Direction.East;
        } else if (S){
            direction = Direction.South;
        } else if (W){
            direction = Direction.West;
        } else {
            direction = Direction.None;
        }

        return direction;
    }

    public createNewRoot(plantData: PlantData){
        plantData.__rootData.push(plantData.newRootLocation);
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

        scene.events.emit(Events.DeadRootToLand, plantData.__rootData);
        plantData.__rootData = [];

        if(plantData === this._userPlant){
            scene.events.emit(Events.GameOver);

        }
    }

    private PlacePlants(scene: Phaser.Scene): void {
        for(let x = 1; x < Game_Config.MAP_SIZE.x - 1; x+=6){
            if(!(x > this._userPlant.startPos.x - 3 && x < this._userPlant.startPos.x + 3) && Math.random() > 0.5){
                

                let plantHeight: number;

                for(let y = 0; y < Game_Config.MAP_SIZE.y; y++){
                    if(this._mapManager.isLandTileAccessible({x: x, y: y})){
                        plantHeight = y;
                        break;
                    }
                }

                // console.log(plantHeight);

                
                let aiPlant = new PlantData(scene, {x: x, y: plantHeight}, true);
                this._mapManager.DestroyTile({x: x, y: plantHeight});
                this._aiPlants.push(aiPlant);
            }
        }
    }

    private setupEventResponses(): void{



        this._scene.events.on(Events.RootGrowthRequest, (rootData: RootData) => {

            let directionTowardsPlant = this.checkIfPlantIsClose(rootData.plant, rootData.coords);
            
            if(directionTowardsPlant !== Direction.None){
                rootData.plant.newRootLocation = rootData.coords;
                rootData.plant.newRootDirection = directionTowardsPlant;
            } else {
                rootData.plant.newRootLocation = null;
                rootData.plant.newRootDirection = Direction.None;
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

