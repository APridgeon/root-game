import * as Phaser from "phaser";
import { Events } from "../events/events";
import MapManager from "../map/mapManager";
import PlantData, { Position } from "../plant/plantData";
import PlantManager from "../plant/plantManager";
import { Direction, DirectionVectors } from "../general/direction";
import Game_Config from "../game_config";


export default class TurnHandler {

    private _scene: Phaser.Scene;
    private _plantManager: PlantManager;
    private _mapManager: MapManager;

    private _turnNo: integer = 0;
    get turnNo(){
        return this._turnNo;
    }

    constructor(scene: Phaser.Scene, plantManager: PlantManager, mapManager: MapManager){

        this._scene = scene;
        this._plantManager = plantManager;
        this._mapManager = mapManager;


        scene.scene.get('UI').events.on(Events.TurnConfirm, () => {

            this.playerRootCreation();
            this.aiRootCreation();

            plantManager.checkPlantWaterLevels(scene);
            plantManager.plantDisplay.updatePlantDisplay();

            this._turnNo += 1;
            this._scene.events.emit(Events.UpdateUIText, this._turnNo);

        })


    }

    private playerRootCreation(): void{

        let plant = this._plantManager.userPlant;
        let worldTileIsAccessable = this._mapManager.isLandTileAccessible(plant.newRootLocation);

        if(worldTileIsAccessable){
            while(plant.strength > 0){
                // attack tile and update that tile and surrounding tile displays
                let destroyed = this._mapManager.AttackTile(plant.newRootLocation, plant);
                if(destroyed){
                    // add root to plant data class
                    this._plantManager.createNewRoot(plant);
                    // sets off destroyed tile animation
                    this._scene.events.emit(Events.RootGrowthSuccess, plant.newRootLocation);
                    let directionVector = DirectionVectors.vectors.get(plant.newRootDirection);
                    //set new root location 
                    plant.newRootLocation = {x: plant.newRootLocation.x + directionVector.x, y: plant.newRootLocation.y + directionVector.y};
                    //check if the new location is accessible if not stop this loop
                    let worldTileIsAccessable = this._mapManager.isLandTileAccessible(plant.newRootLocation);
                    if(!worldTileIsAccessable){
                        break;
                    }
                }
            }
        }

        this._scene.events.emit(Events.AbsorbWater, this._plantManager.userPlant);
        this._plantManager.userPlant.newRootLocation = null;
        this._plantManager.userPlant.newRootDirection = Direction.None;
        plant.strength = Game_Config.PLANT_STRENGTH;
    }

    private aiRootCreation(): void {
        this._plantManager.aiPlants.forEach(aiplant => {
            if(aiplant.alive){
                aiplant.aiController.aiRootChoice();

                let plant = aiplant;
                let worldTileIsAccessable = this._mapManager.isLandTileAccessible(plant.newRootLocation);
        
                if(worldTileIsAccessable){
                    while(plant.strength > 0){
                        let destroyed = this._mapManager.AttackTile(plant.newRootLocation, plant);
                        if(destroyed){
                            this._plantManager.createNewRoot(plant);
                            this._scene.events.emit(Events.RootGrowthSuccess, plant.newRootLocation);
                            let directionVector = DirectionVectors.vectors.get(plant.newRootDirection);
                            plant.newRootLocation = {x: plant.newRootLocation.x + directionVector.x, y: plant.newRootLocation.y + directionVector.y};
                            
                            let worldTileIsAccessable = this._mapManager.isLandTileAccessible(plant.newRootLocation);
                            if(!worldTileIsAccessable){
                                break;
                            }
                        }
                    }
                }

                this._scene.events.emit(Events.AbsorbWater, plant);
                aiplant.newRootLocation = null;
                aiplant.newRootDirection = Direction.None;
                plant.strength = Game_Config.PLANT_STRENGTH;
            }
        })
    }


}