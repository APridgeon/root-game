import { Events } from "../events/events";
import Game_Config from "../game_config";
import { Position } from "../plant/plantData";
import Box from "./box";
import { BoxTiles } from "./UI_TileSets";


export default class TurnBox extends Box {

    _scene: Phaser.Scene;

    text: Phaser.GameObjects.BitmapText;


    constructor(scene, tilemap: Phaser.Tilemaps.Tilemap, boxStyle: Map<BoxTiles, integer>, x: number, y: number, width: number, height: number){
        
        super(tilemap, boxStyle, x, y, width, height);

        this._scene = scene;
        
        this.text = this._scene.add.bitmapText(x + Game_Config.UI_tilesToWorld(1) + (Game_Config.UI_SCALE * 1), y + Game_Config.UI_tilesToWorld(2) , 'ant_party', 'Turn no: 0')
            .setOrigin(0,0)
            .setTint(0x000000)
            .setScale(Game_Config.FONT_SCALE)
            .setDepth(10);
        
        this.resize()

        

    }

    private resize(){
        this._scene.game.events.on(Events.screenSizeChange, (screenDim: Position) => {
            this.pos = {x: screenDim.x-Game_Config.UI_tilesToWorld(10), y: screenDim.y-Game_Config.UI_tilesToWorld(10)}
            this.setPosition(this.pos);
            let w = this.text.getTextBounds().global.width;
            let boxW = Game_Config.UI_tilesToWorld(this.width);
            let off = (boxW - w) / 2;
            this.text.setPosition(this.pos.x + off, this.pos.y + Game_Config.UI_tilesToWorld(2))
            console.log(this.text.getTextBounds());
        })
    }

}