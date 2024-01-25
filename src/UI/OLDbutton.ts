import * as Phaser from "phaser";
import Game_Config from "../game_config";
import { BoxTiles } from "./UI_TileSets";
import Box from "./box";


export default class Button extends Box {

    pointerOver: boolean = false;
    pointerZone: Phaser.GameObjects.Zone;
    textOffset = 0.7;

    constructor(scene: Phaser.Scene, tilemap: Phaser.Tilemaps.Tilemap, boxStyle: Map<BoxTiles, integer>, x: number, y: number, text: string){

        super(tilemap, boxStyle, x, y, 3, 3);

        let width = 3;
        let height = 3;

        let tile = this.boxLayer.getTileAt(0,0);
        let rect = (tile.getBounds() as Phaser.Geom.Rectangle);

        let textObject = scene.add.bitmapText(rect.centerX + (rect.width*this.textOffset),  rect.centerY + (rect.height*this.textOffset), 'ant_party', text)
            .setOrigin(0,0)
            .setTint(0x000000)
            .setScale(Game_Config.FONT_SCALE)
            .setDepth(10);

        width = Math.floor(textObject.width / Game_Config.UI_tilesToWorld(1)) + 3;
        
        this.SetBoxSize(width, height);

        this.pointerZone = scene.add.zone(rect.x, rect.y, rect.width*width, rect.height*height)
            .setOrigin(0,0)
            .setInteractive();

        this.SetupColours(this.pointerZone);




    }

    private SetupColours(pointerZone): void {
        pointerZone.on("pointerover", () => {
            this.pointerOver = true;
            this.boxLayer.forEachTile(tile => {
                tile.tint = 0xff9999;
            })
        })

        pointerZone.on("pointerout", () => {
            this.pointerOver = false;
            this.boxLayer.forEachTile(tile => {
                tile.tint = 0xffffff;
            })
        })
    
        pointerZone.on("pointerdown", () => {
            this.boxLayer.forEachTile(tile => {
                tile.tint = 0xff5555;
            })
        })

        pointerZone.on("pointerup", () => {
            this.boxLayer.forEachTile(tile => {
                if(this.pointerOver){
                    tile.tint = 0xff9999;
                } else {
                    tile.tint = 0xffffff;
                }
            })
        })
    }
}