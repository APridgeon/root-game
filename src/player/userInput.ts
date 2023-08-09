import * as Phaser from "phaser";
import { Events } from "../events/events";
import MapManager from "../map/mapManager";
import PlantData, { Position } from "../plant/plantData";
import PlantManager from "../plant/plantManager";


export type RootData = {
    plant: PlantData,
    coords: Position
}

export default class InputHandler {

    currentSelection;

    constructor(scene: Phaser.Scene, plantManager: PlantManager, mapManager: MapManager){

        scene.input.on('pointerup', (p: Phaser.Input.Pointer) => {
            
            let timeDown = p.upTime - p.downTime;

            if(timeDown < 200){
                let tileCoords = mapManager.mapDisplay.tilemap.worldToTileXY(p.worldX, p.worldY);

                let rootData: RootData = {
                    plant: plantManager.userPlant,
                    coords: tileCoords
                }
    
                scene.events.emit(Events.RootGrowthRequest, rootData);
                scene.scene.get('UI').events.emit(Events.TurnConfirm);
            }
        })
    }
}