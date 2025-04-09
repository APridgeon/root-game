import Game_Config from "../game_config";
import MapManager from "../map/mapManager";
import PlantData, { Position } from "./plantData";
import PlantDisplay from "./plantDisplay";
import WaterHandler from "./waterHandling";
import { Events } from "../events/events";
import { RootData } from "../player/userInput";
import { LandTypes } from "../map/data/landGenerator";
import { Direction } from "../general/direction";
import Main from "../game";
import { use } from "matter";


export default class PlantManager {

    scene: Main;
    mapManager: MapManager;
    plantDisplay: PlantDisplay;

    userPlant: PlantData;
    aiPlants: PlantData[] = [];

    gameOver: boolean = false;

    constructor(scene: Main, mapManager: MapManager){

        this.scene = scene;
        this.mapManager = mapManager;

        const plantHeight = (() => {for(let y = 0; y < Game_Config.MAP_SIZE.y; y++){
            const tile = this.mapManager.mapData.landGenerator.landData[y][Game_Config.PLANT_STARTING_POSX];
            if(tile.landType !== LandTypes.None) return y
        }})()

        this.userPlant = new PlantData(scene, {x: Game_Config.PLANT_STARTING_POSX, y: plantHeight}, false);
        this.mapManager.DestroyTile({x: Game_Config.PLANT_STARTING_POSX, y: plantHeight});
        
        this.PlacePlants(scene);
        this.plantDisplay = new PlantDisplay(scene, this);

        new WaterHandler(scene, mapManager);

        this.setupEventResponses();

    }

    public checkIfPlantIsClose(plantData: PlantData, tile: Position): Direction{
        const {x, y} = tile;

        const N = plantData.__rootData.some(val => {
            return ((val.x == x) && ((val.y - 1) === (y))) ? true : false;
        });
        const E = plantData.__rootData.some(val => {
            return ((val.x + 1 === x) && ((val.y) === (y))) ? true : false;
        });
        const S = plantData.__rootData.some(val => {
            return ((val.x === x) && ((val.y + 1) === (y))) ? true : false;
        });
        const W = plantData.__rootData.some(val => {
            return ((val.x - 1 === x) && ((val.y) === (y))) ? true : false;
        });
        
        if(N) return Direction.North;
        else if (E) return Direction.East;
        else if (S) return Direction.South;
        else if (W) return Direction.West;
        else return Direction.None
    }

    public createNewRoot(plantData: PlantData){
        plantData.__rootData.push(plantData.newRootLocation);
    }

    public checkPlantWaterLevels(scene: Phaser.Scene){
        if(this.userPlant.water < 0) this.destroyPlant(this.userPlant, scene);
        this.aiPlants.forEach(plant => {
            if(plant.water < 0) this.destroyPlant(plant, scene);
        })
    }

    public destroyPlant(plantData: PlantData, scene: Phaser.Scene){
        plantData.alive = false;
        this.plantDisplay.destroyAerialTree(plantData);

        scene.events.emit(Events.DeadRootToLand, plantData.__rootData);
        this.plantDisplay.updatePlantDisplay();
        plantData.__rootData = [];

        if(plantData === this.userPlant) scene.events.emit(Events.GameOver);
    }

    private PlacePlants(scene: Main): void {
        for(let x = 1; x < Game_Config.MAP_SIZE.x - 1; x+=6){
            const user_x = this.userPlant.startPos.x;
            if(!(x > user_x - 3 && x < user_x + 3) && Math.random() > 0.5){
                
                const plantHeight = (() => {for(let y = 0; y < Game_Config.MAP_SIZE.y; y++){
                    if(this.mapManager.isLandTileAccessible({x: x, y: y})) return y
                }})()
                
                const aiPlant = new PlantData(scene, {x: x, y: plantHeight}, true);
                this.mapManager.DestroyTile({x: x, y: plantHeight});
                this.aiPlants.push(aiPlant);
            }
        }
    }

    private setupEventResponses(): void{
        this.scene.events.on(Events.RootGrowthRequest, (rootData: RootData) => {

            const directionTowardsPlant = this.checkIfPlantIsClose(rootData.plant, rootData.coords);
            
            if(directionTowardsPlant !== Direction.None){
                rootData.plant.newRootLocation = rootData.coords;
                rootData.plant.newRootDirection = directionTowardsPlant;
            } else {
                rootData.plant.newRootLocation = null;
                rootData.plant.newRootDirection = Direction.None;
            }
        })

        this.scene.events.on(Events.GameOver, () => this.gameOver = true);
    }
}

