import * as Phaser from "phaser";
import { Events } from "../events/events";
import MapManager from "../map/mapManager";
import PlantData, { Position } from "../plant/plantData";
import PlantManager from "../plant/plantManager";


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
        if(this._plantManager.userPlant.newRootLocation){
            this._plantManager.createNewRoot(this._plantManager.userPlant, this._plantManager.userPlant.newRootLocation);
            this._mapManager.DestroyTile(this._plantManager.userPlant.newRootLocation);
        }
        this._scene.events.emit(Events.AbsorbWater, this._plantManager.userPlant);
        this._plantManager.userPlant.newRootLocation = null;
    }

    private aiRootCreation(): void {
        this._plantManager.aiPlants.forEach(aiplant => {
            if(aiplant.alive){
                aiplant.aiController.aiRootChoice();
                if(aiplant.newRootLocation){
                    this._plantManager.createNewRoot(aiplant, aiplant.newRootLocation);
                    this._mapManager.DestroyTile(aiplant.newRootLocation);
                }
                this._scene.events.emit(Events.AbsorbWater, aiplant);
                aiplant.newRootLocation = null;
            }
        })
    }

    private playerAerialGrowth(): void {
        if(this._plantManager.userPlant.rootData.flat(2).filter(value => value === true).length > 10){
            this._scene.events.emit(Events.AerialGrowth, this._plantManager.userPlant);
        }
    }

    private aiAerialGrowth(): void {
        this._plantManager.aiPlants.forEach(plantData => {
            if(plantData.rootData.flat(2).filter(value => value === true).length > 10){
                this._scene.events.emit(Events.AerialGrowth, plantData);
            }
        })
    }


}