import * as Phaser from "phaser";
import { Events } from "../events/events";
import MapManager from "../map/mapManager";
import PlantData, { Position } from "../plant/plantData";
import PlantManager from "../plant/plantManager";
import { Direction, DirectionVectors } from "../general/direction";


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

            this.playerAerialGrowth();
            this.aiAerialGrowth();

            plantManager.checkPlantWaterLevels(scene);

            plantManager.plantDisplay.updatePlantDisplay();
            mapManager.mapDisplay.updateRuleTileMap();


            this._turnNo += 1;

            this._scene.events.emit(Events.UpdateUIText, this._turnNo);

        })


    }

    private playerRootCreation(): void{

        let plant = this._plantManager.userPlant;
        let worldTileIsAccessable = this._mapManager.isLandTileAccessible(plant.newRootLocation);
        let directionVector = DirectionVectors.vectors.get(plant.newRootDirection);

        if(worldTileIsAccessable){
            while(plant.strength > 0){
                let destroyed = this._mapManager.AttackTile(plant.newRootLocation, plant);
                if(destroyed){
                    this._plantManager.createNewRoot(plant);
                    this._scene.events.emit(Events.RootGrowthSuccess, plant.newRootLocation);
                    plant.newRootLocation = {x: plant.newRootLocation.x + directionVector.x, y: plant.newRootLocation.y + directionVector.y};
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
        plant.strength = 1;
        console.log("finished");
    }

    private aiRootCreation(): void {
        this._plantManager.aiPlants.forEach(aiplant => {
            if(aiplant.alive){
                aiplant.aiController.aiRootChoice();


                let plant = aiplant;
                let worldTileIsAccessable = this._mapManager.isLandTileAccessible(plant.newRootLocation);
                let directionVector = DirectionVectors.vectors.get(plant.newRootDirection);
        
                if(worldTileIsAccessable){
                    while(plant.strength > 0){
                        let destroyed = this._mapManager.AttackTile(plant.newRootLocation, plant);
                        if(destroyed){
                            this._plantManager.createNewRoot(plant);
                            this._scene.events.emit(Events.RootGrowthSuccess, plant.newRootLocation);
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
                plant.strength = 1;
            }
        })
    }

    private playerAerialGrowth(): void {

        if(this._plantManager.userPlant.__rootData.length > 10){
            this._scene.events.emit(Events.AerialGrowth, this._plantManager.userPlant);
        }

    }

    private aiAerialGrowth(): void {
        this._plantManager.aiPlants.forEach(plantData => {
            if(plantData.__rootData.length > 10){
                this._scene.events.emit(Events.AerialGrowth, plantData);
            }
        })
    }


}