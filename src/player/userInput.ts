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

    private currentTileSelection: Phaser.Tilemaps.Tile;

    private _scene: Phaser.Scene;
    private _plantManager: PlantManager;
    private _mapManager: MapManager;

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

        this._scene.input.on('pointermove', (p: Phaser.Input.Pointer, go: Phaser.GameObjects.GameObject[]) => {

            let pointerTileCo: Position = {x: Game_Config.MAP_worldToTiles(p.worldX), y: Game_Config.MAP_worldToTiles(p.worldY)};

            if(this._mapManager.mapData.waterData[pointerTileCo.y][pointerTileCo.x]){

                let newTile = this._mapManager.mapDisplay.tilemap.getTileAt(pointerTileCo.x, pointerTileCo.y, null, 'water');
                if(newTile === this.currentTileSelection){
                    return
                } else {
                    if(this.currentTileSelection){this.currentTileSelection.tint = 0xffffff}
                    this.currentTileSelection = newTile;
                    this.currentTileSelection.tint = 0xff9999;
                }
            } else if(this._mapManager.mapData.landData[pointerTileCo.y][pointerTileCo.x]){
                let newTile = this._mapManager.mapDisplay.tilemap.getTileAt(pointerTileCo.x, pointerTileCo.y, null, 'land');
                if(newTile === this.currentTileSelection){
                    return
                } else {
                    if(this.currentTileSelection){this.currentTileSelection.tint = 0xffffff}
                    this.currentTileSelection = newTile;
                    this.currentTileSelection.tint = 0xff9999;
                }
            } else {
                if(this.currentTileSelection){this.currentTileSelection.tint = 0xffffff}
                this.currentTileSelection = null;
            }
        })
    }


}