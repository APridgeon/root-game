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

        const direction = (() => {for(const pos of plantData.rootData){
            if(pos.x === x && pos.y-1 === y) return Direction.North;
            if(pos.x+1 === x && pos.y === y) return Direction.East;
            if(pos.x === x && pos.y+1 === y) return Direction.South;
            if(pos.x-1 === x && pos.y === y) return Direction.West;
        }})()

        return (direction) ? direction : Direction.None;
    }

    public createNewRoot(plantData: PlantData){
        plantData.rootData.push(plantData.newRootLocation);
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

        scene.events.emit(Events.DeadRootToLand, plantData.rootData);
        this.plantDisplay.updatePlantDisplay();
        plantData.rootData = [];

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

