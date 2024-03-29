import Game_Config from "../../game_config";
import UI from "../UI_scene";
import { BoxTiles } from "../UI_TileSets";
import Box from "./box";
import * as Phaser from "phaser";

export default class GuideBox extends Box {

    title: Phaser.GameObjects.BitmapText;
    text: Phaser.GameObjects.BitmapText;

    zone: Phaser.GameObjects.Zone;

    constructor(title: string, text: string, scene: UI, boxstyle: Map<BoxTiles, number>, x: number, y: number){

        super(scene, scene.uiTileMap, boxstyle, x, y, 5, 5);

        this.generateText(title, text);
        this.resizeWidthAndHeight();

        this.zone = this._scene.add.zone(this.pos.x, this.pos.y, Game_Config.UI_tilesToWorld(this.width), Game_Config.UI_tilesToWorld(this.height)).setOrigin(0,0);
        this.zone.setInteractive();
        this.zone.on(Phaser.Input.Events.POINTER_DOWN, () => {
            console.log("HEYYY")
            this.boxLayer.destroy()
            this.title.destroy()
            this.text.destroy()
        })

    }

    generateText(title: string, text: string){
        this.title = this._scene.add.bitmapText(this.pos.x + Game_Config.UI_tilesToWorld(1) + (Game_Config.UI_SCALE * 1), this.pos.y + Game_Config.UI_tilesToWorld(1) + (Game_Config.UI_SCALE * 1) , 'ant_party', title)
            .setOrigin(0,0)
            .setTint(0x000000)
            .setScale(Game_Config.FONT_SCALE)
            .setDepth(10);

        this.text = this._scene.add.bitmapText(this.pos.x + Game_Config.UI_tilesToWorld(1) + (Game_Config.UI_SCALE * 1), this.pos.y + Game_Config.UI_tilesToWorld(3) , 'ant_party', text)
            .setOrigin(0,0)
            .setTint(0x000000)
            .setScale(Game_Config.FONT_SCALE)
            .setDepth(10);
    }

    resizeWidthAndHeight(){

        //Determining size of box
        let titleWidth = this.title.getTextBounds().global.width;
        let textWidth = this.text.getTextBounds().global.width;
        let maxWidth = Math.max(titleWidth, textWidth);
        let width = Game_Config.UI_worldToTiles(maxWidth)

        let titleHeight = this.title.getTextBounds().global.height;
        let textHeight = this.text.getTextBounds().global.height;
        let totalHeight = titleHeight + textHeight;
        let height = Game_Config.UI_worldToTiles(totalHeight);

        this.SetBoxSize(width + 3, height + 4);


        //Determining text placement
        let boxW = Game_Config.UI_tilesToWorld(width + 3);
        let offW = (boxW - maxWidth) / 2;
        let boxHeight = Game_Config.UI_tilesToWorld(height + 4);
        let offH = (boxHeight - (titleHeight + textHeight)) / 3;
        this.title.setPosition(this.pos.x + offW, this.pos.y + offH);
        this.text.setPosition(this.pos.x + offW, this.pos.y + titleHeight + (offH * 2));

    }   


}