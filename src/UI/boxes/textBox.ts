import { Events } from "../../events/events";
import Game_Config from "../../game_config";
import { Position } from "../../plant/plantData";
import Box from "./box";
import { BoxTiles } from "../UI_TileSets";


export default class TextBox extends Box {

    _scene: Phaser.Scene;

    text: Phaser.GameObjects.BitmapText;


    constructor(text: string, scene, tilemap: Phaser.Tilemaps.Tilemap, boxStyle: Map<BoxTiles, integer>, x: number, y: number, width: number, height: number){
        
        super(scene, tilemap, boxStyle, x, y, width, height);

        this._scene = scene;
        
        this.text = this._scene.add.bitmapText(this.pos.x + Game_Config.UI_tilesToWorld(1) + (Game_Config.UI_SCALE * 1), this.pos.y + Game_Config.UI_tilesToWorld(2) , 'ant_party', text)
            .setOrigin(0,0)
            .setTint(0x000000)
            .setScale(Game_Config.FONT_SCALE)
            .setDepth(10);
        
        this.recenterText()
        this.resize()


    }

    public setText(text: string){
        this.text.setText(text);
        this.recenterText();
    }

    private resize(){
        this._scene.game.events.on(Events.screenSizeChange, (screenDim: Position) => {
            this.setPosition(this.rawPos, screenDim.x, screenDim.y);
            this.recenterText();
        })
    }

    private recenterText(){
        let w = this.text.getTextBounds().global.width;
        let boxW = Game_Config.UI_tilesToWorld(this.width);
        let off = (boxW - w) / 2;
        this.text.setPosition(this.pos.x + off, this.pos.y + Game_Config.UI_tilesToWorld(2))
    }

}