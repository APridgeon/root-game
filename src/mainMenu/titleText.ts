import UI_TileSets from "../UI/UI_TileSets";
import Box from "../UI/box";
import { Events } from "../events/events";
import Game_Config from "../game_config";
import { Position } from "../plant/plantData";
import MainMenu from "./mainMenu";


export default class TitleText {

    _scene: MainMenu;

    bitmapText: Phaser.GameObjects.BitmapText;
    backgroundBox: Box;

    clickEvent: Phaser.Events.EventEmitter;

    constructor(scene: MainMenu){

        this._scene = scene;

        this.createTitle();
        this.backgroundBox = new Box(this._scene.tileMap, UI_TileSets.boxStyle3, 0, Game_Config.UI_tilesToWorld(4), Game_Config.UI_worldToTiles(this._scene.game.scale.width), 10);

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
        let pos: Position;
        let fontSize;
        if(screenDim.x <  this.bitmapText.width - Game_Config.UI_tilesToWorld(2)){
            this.bitmapText.setText('Welcome\nto\nTAPROOT')
            pos = { x: Game_Config.UI_tilesToWorld(3), y: Game_Config.UI_tilesToWorld(4)};
            fontSize = 40;
        } else {
            this.bitmapText.setText('Welcome to TAPROOT')
            pos = { x: Game_Config.UI_tilesToWorld(4), y: Game_Config.UI_tilesToWorld(2)};
            fontSize = 60;
        }

        this.bitmapText.setPosition(pos.x, pos.y)
        this.bitmapText.setFontSize(fontSize)
        this.backgroundBox.setPosition({x: Game_Config.UI_tilesToWorld(0), y: Game_Config.UI_tilesToWorld(0)});
        this.backgroundBox.SetBoxSize(Game_Config.UI_worldToTiles(this._scene.game.scale.width), Game_Config.UI_worldToTiles(this.bitmapText.height) + 4);
        
        this.bitmapText.resetPostPipeline();
        this.bitmapText.postFX.addShine(1, 0.8, 3,false);
    }

}
