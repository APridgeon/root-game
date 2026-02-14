import * as Phaser from "phaser";
import { Events } from "../events/events";
import MapManager from "../map/mapManager";
import PlantData, { Position } from "../plant/plantData";
import PlantManager from "../plant/plantManager";
import Game_Config from "../game_config";
import PointerCrosshair from "./pointerCrosshair";


export type RootData = {
    plant: PlantData,
    coords: Position
}

export default class InputHandler {

    private _scene: Phaser.Scene;
    private _plantManager: PlantManager;
    private _mapManager: MapManager;

    constructor(scene: Phaser.Scene, plantManager: PlantManager, mapManager: MapManager){

        this._scene = scene;
        this._plantManager = plantManager;
        this._mapManager = mapManager;

        this.setupClickEvent();

        new PointerCrosshair(this._scene);

        
    }

    private setupClickEvent(): void {
        this._scene.input.on('pointerup', (p: Phaser.Input.Pointer) => {
            
            const timeDown = p.upTime - p.downTime;

            if(timeDown < 200){
                const tileCoords = this._mapManager.mapDisplay.tilemap.worldToTileXY(p.worldX, p.worldY) as Position;

                const rootData: RootData = {
                    plant: this._plantManager.userPlant,
                    coords: tileCoords
                }
    
                this._scene.events.emit(Events.RootGrowthRequest, rootData);
                this._scene.scene.get('UI').events.emit(Events.TurnConfirm);
            }
        })
    }


}