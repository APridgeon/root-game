import * as Phaser from "phaser";
import { Events } from "../events/events";
import MapManager from "../map/mapManager";
import PlantData, { Position } from "../plant/plantData";
import PlantManager, { Direction } from "../plant/plantManager";


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
        if(this._plantManager.userPlant.newRootDirection !== Direction.None){
            let destroyed = this._mapManager.DestroyTile(this._plantManager.userPlant.newRootLocation);
                if(destroyed){
                    this._plantManager.createNewRoot(this._plantManager.userPlant);
                }
        }
        this._scene.events.emit(Events.AbsorbWater, this._plantManager.userPlant);
        this._plantManager.userPlant.newRootLocation = null;
        this._plantManager.userPlant.newRootDirection = Direction.None;
    }

    private aiRootCreation(): void {
        this._plantManager.aiPlants.forEach(aiplant => {
            if(aiplant.alive){
                aiplant.aiController.aiRootChoice();
                if(aiplant.newRootDirection !== Direction.None){
                    let destroyed = this._mapManager.DestroyTile(aiplant.newRootLocation);
                    if(destroyed){
                        this._plantManager.createNewRoot(aiplant);
                    }
                }
                this._scene.events.emit(Events.AbsorbWater, aiplant);
                aiplant.newRootLocation = null;
                aiplant.newRootDirection = Direction.None;
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