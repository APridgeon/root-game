import Box from "../UI/box";
import { Events } from "../events/events";
import Game_Config from "../game_config";
import { Position } from "../plant/plantData";


export default class TitleText {

    _scene: Phaser.Scene;

    bitmapText: Phaser.GameObjects.BitmapText;
    backgroundBox: Box;

    clickEvent: Phaser.Events.EventEmitter;

    constructor(scene: Phaser.Scene){

        this._scene = scene;

        this.createTitle();
        this.setCorrectSize({x: this._scene.scale.width, y: this._scene.scale.height});

        this.clickEvent = this._scene.game.events.on(Events.screenSizeChange, (screenDim: Position) => {
            this.setCorrectSize(screenDim);
        })
        

    }

    createTitle(){
        this.bitmapText = this._scene.add.bitmapText(Game_Config.UI_tilesToWorld(4), Game_Config.UI_tilesToWorld(6), 'ant_party', 'Welcome to TAPROOT', 60)
            .setTint(0x333333)
            .setOrigin(0,0)
            .setDropShadow(2,2,0xffffff)
            .setDepth(10);

        this.bitmapText.postFX.addShine(1, 0.8, 3,false);
    }

    setCorrectSize(screenDim: Position){
        if(screenDim.x <  this.bitmapText.width - Game_Config.UI_tilesToWorld(2)){
            this.bitmapText.setText('Welcome\nto\nTAPROOT')
            this.bitmapText.setPosition(Game_Config.UI_tilesToWorld(1), Game_Config.UI_tilesToWorld(6))
            this.bitmapText.setFontSize(40)
        } else {
            this.bitmapText.setText('Welcome to TAPROOT')
            this.bitmapText.setPosition(Game_Config.UI_tilesToWorld(4), Game_Config.UI_tilesToWorld(6))
            this.bitmapText.setFontSize(60)
        }
        
        this.bitmapText.resetPostPipeline();
        this.bitmapText.postFX.addShine(1, 0.8, 3,false);
    }

}
