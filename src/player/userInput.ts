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

        let pointerIm = this._scene.add.image(220, 220, 'inputPrompts', (24 * 34) + 1)
            .setOrigin(0.5, 0.5)
            .setScale(2)
            .setTint(0xffffff)
            .setAlpha(0.8)
            .setDepth(10);

        this._scene.time.addEvent({
            delay: 250,
            loop: true,
            callback: () => {
                let newSprite = (pointerIm.frame.name === ((24 * 34) + 1)) ? (24 * 34) + 0 : (24 * 34) + 1;
                pointerIm.setFrame(newSprite);
            }
        })

        this._scene.input.on('pointermove', (p: Phaser.Input.Pointer, go: Phaser.GameObjects.GameObject[]) => {

            let pointerTileCo: Position = {x: Game_Config.MAP_worldToTiles(p.worldX), y: Game_Config.MAP_worldToTiles(p.worldY)};
            let imCo: Position = {x: Game_Config.MAP_tilesToWorld(pointerTileCo.x) + 8, y: Game_Config.MAP_tilesToWorld(pointerTileCo.y) + 8};

            pointerIm.setPosition(imCo.x, imCo.y);

        })
    }


}