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

    playerRootCreation(): void{

        const plant = this._plantManager.userPlant;
        const is_accessable = this._mapManager.isLandTileAccessible(plant.newRootLocation);

        if(is_accessable){
            while(plant.strength > 0){
                const is_destroyed = this._mapManager.AttackTile(plant.newRootLocation, plant);
                if(is_destroyed){
                    this._plantManager.createNewRoot(plant);
                    this._scene.events.emit(Events.RootGrowthSuccess, plant.newRootLocation);
                    const directionVector = DirectionVectors.vectors.get(plant.newRootDirection);
                    plant.newRootLocation = {x: plant.newRootLocation.x + directionVector.x, y: plant.newRootLocation.y + directionVector.y};
                    const is_new_accessible = this._mapManager.isLandTileAccessible(plant.newRootLocation);
                    if(!is_new_accessible) break
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