import UI_TileSets from "../UI/UI_TileSets";
import Box from "../UI/box";
import Game_Config from "../game_config";
import MainMenu from "./mainMenu";
import * as Phaser from "phaser";



export default class PlayerChoices {

    _scene: MainMenu;

    backgroundBox: Box;
    titleText: Phaser.GameObjects.BitmapText;
    plantChoices: Phaser.GameObjects.BitmapText[] = [];

    constructor(scene: MainMenu){
        this._scene = scene;

        this.backgroundBox = new Box(this._scene.tileMap, UI_TileSets.boxStyle2, Game_Config.UI_tilesToWorld(5), Game_Config.UI_tilesToWorld(15), 12, 3);
        // this.backgroundBox.boxLayer.preFX.addBlur();

        this._scene.time.addEvent({
            callback: () => {
                this.backgroundBox.height += 1;
                this.backgroundBox.SetBoxSize(this.backgroundBox.width, this.backgroundBox.height);
            },
            delay: 100,
            repeat: 3
        })

        this._scene.time.addEvent({
            callback: () => {
                this.createText()
            },
            delay: 400,
            repeat: 0
        })




    }

    createText(){
        this.titleText = this._scene.add.bitmapText(Game_Config.UI_tilesToWorld(6), Game_Config.UI_tilesToWorld(16), 'ant_party', 'Choose your plant type')
            .setOrigin(0,0)
            .setTintFill(0x000000)
            .setScale(Game_Config.FONT_SCALE)
            .setDepth(10)


        this.plantChoices.push(this._scene.add.bitmapText(Game_Config.UI_tilesToWorld(6), Game_Config.UI_tilesToWorld(18), 'ant_party', 'Oak'))
        this.plantChoices.push(this._scene.add.bitmapText(Game_Config.UI_tilesToWorld(6), Game_Config.UI_tilesToWorld(19), 'ant_party', 'Willow'))
        this.plantChoices.push(this._scene.add.bitmapText(Game_Config.UI_tilesToWorld(6), Game_Config.UI_tilesToWorld(20), 'ant_party', 'Square'));

        this.plantChoices.forEach(text => {
            text.setOrigin(0,0)
                .setTintFill(0x000000)
                .setScale(Game_Config.FONT_SCALE)
                .setDepth(10)
                .setActive(true)
            
            text.on(Phaser.Input.Events.POINTER_OVER, () => {
            console.log("hello!")
            })
        })
    }

}