import * as Phaser from "phaser";
import { Events } from "../events/events";
import MapManager from "../map/mapManager";
import PlantData, { Position } from "../plant/plantData";
import PlantManager from "../plant/plantManager";
import Game_Config from "../game_config";


export type RootData = {
    plant: PlantData,
    coords: Position
}

export default class InputHandler {

    _scene: Phaser.Scene;
    _plantManager: PlantManager;
    _mapManager: MapManager;

    constructor(scene: Phaser.Scene, plantManager: PlantManager, mapManager: MapManager){

        this._scene = scene;
        this._plantManager = plantManager;
        this._mapManager = mapManager;

        this.setupClickEvent();
        this.setupHover();

        
    }

    private setupClickEvent(): void {
        this._scene.input.on('pointerup', (p: Phaser.Input.Pointer) => {
            
            let timeDown = p.upTime - p.downTime;

            if(timeDown < 200){
                let tileCoords = this._mapManager.mapDisplay.tilemap.worldToTileXY(p.worldX, p.worldY);

                let rootData: RootData = {
                    plant: this._plantManager.userPlant,
                    coords: tileCoords
                }
    
                this._scene.events.emit(Events.RootGrowthRequest, rootData);
                this._scene.scene.get('UI').events.emit(Events.TurnConfirm);
            }
        })
    }

    private setupHover(): void {
        this._scene.input.on('pointermove', (p: Phaser.Input.Pointer) => {
            let tile = this._mapManager.mapDisplay.tilemap.findTile(() => true, null, Game_Config.MAP_worldToTiles(p.worldX), Game_Config.MAP_worldToTiles(p.worldY));
            tile.tint = 0xaa6666;
        })
    }


}