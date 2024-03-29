import UI_TileSets from "../UI/UI_TileSets";
import Box from "../UI/boxes/box";
import { Events } from "../events/events";
import Game_Config from "../game_config";
import { TreeType } from "../plant/aerialTreeTiles";
import { Position } from "../plant/plantData";
import MainMenu from "./mainMenu";
import * as Phaser from "phaser";

export type PlayerChoice = {
    treeChoice: TreeType;
}

export default class PlayerChoices {

    _scene: MainMenu;

    backgroundBox: Box;
    titleText: Phaser.GameObjects.BitmapText;
    plantChoices: Phaser.GameObjects.BitmapText[] = [];
    plantChoicesRects: Phaser.GameObjects.Rectangle[] = [];

    treeChoice: TreeType = TreeType.Normal;


    constructor(scene: MainMenu){
        this._scene = scene;

        let boxPos: Position;
        if(this._scene.game.scale.height <  400){
            boxPos = {x: 5, y: 10}
        } else {
            boxPos = {x: 2, y: 15}
        }

        this.backgroundBox = new Box(this._scene, this._scene.tileMap, UI_TileSets.boxStyle2, Game_Config.UI_tilesToWorld(boxPos.x), Game_Config.UI_tilesToWorld(boxPos.y), 12, 3);

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
                this.setCorrectSizes({x: this._scene.game.scale.width, y: this._scene.game.scale.height})
                this._scene.game.events.on(Events.screenSizeChange, (screenDim: Position) => {
                    this.setCorrectSizes(screenDim)
                })
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

        this.plantChoicesRects.push(this._scene.add.rectangle(Game_Config.UI_tilesToWorld(6),Game_Config.UI_tilesToWorld(18), Game_Config.UI_tilesToWorld(4), Game_Config.UI_tilesToWorld(1), 0x000000, 0))
        this.plantChoicesRects.push(this._scene.add.rectangle(Game_Config.UI_tilesToWorld(6),Game_Config.UI_tilesToWorld(19), Game_Config.UI_tilesToWorld(4), Game_Config.UI_tilesToWorld(1), 0x000000, 0))
        this.plantChoicesRects.push(this._scene.add.rectangle(Game_Config.UI_tilesToWorld(6),Game_Config.UI_tilesToWorld(20), Game_Config.UI_tilesToWorld(4), Game_Config.UI_tilesToWorld(1), 0x000000, 0))
        
        this.plantChoices.forEach((text, i) => {
            text.setOrigin(0,0)
                .setTintFill(0x000000)
                .setScale(Game_Config.FONT_SCALE)
                .setDepth(10)
                .setActive(true)
            
            if(i === 0){
                text.setTintFill(0xff0000)
            }
        })

        this.plantChoicesRects.forEach((rect,i) => {
            rect.setOrigin(0, 0)
            rect.setInteractive()
            rect.on(Phaser.Input.Events.POINTER_OVER, () => {
                this.plantChoices.forEach(text => {
                    text.setTintFill(0x000000)
                })
                this.plantChoices[i].setTintFill(0xff0000)
                if(i === 0){
                    this.treeChoice = TreeType.Normal
                } else if(i === 1){
                    this.treeChoice = TreeType.Willow
                } else if(i === 2){
                    this.treeChoice = TreeType.Square
                }
                console.log(this.treeChoice)
            })
                
        })

        
    }

    setCorrectSizes(screenDim: Position){
        if(screenDim.y <  400){
            this.backgroundBox.setPosition({x: Game_Config.UI_tilesToWorld(5), y: Game_Config.UI_tilesToWorld(10)})
            this.titleText.setPosition(Game_Config.UI_tilesToWorld(6), Game_Config.UI_tilesToWorld(11))
            this.plantChoices.forEach((text,i) => {
                text.setPosition(Game_Config.UI_tilesToWorld(6), Game_Config.UI_tilesToWorld(11 + 2 + i))
            })
            this.plantChoicesRects.forEach((rect, i) => {
                rect.setPosition(Game_Config.UI_tilesToWorld(6), Game_Config.UI_tilesToWorld(11 + 2 + i))
            })
        } else {
            this.backgroundBox.setPosition({x: Game_Config.UI_tilesToWorld(2), y: Game_Config.UI_tilesToWorld(15)})
            this.titleText.setPosition(Game_Config.UI_tilesToWorld(3), Game_Config.UI_tilesToWorld(16))
            this.plantChoices.forEach((text,i) => {
                text.setPosition(Game_Config.UI_tilesToWorld(3), Game_Config.UI_tilesToWorld(16 + 2 + i))
            })
            this.plantChoicesRects.forEach((rect, i) => {
                rect.setPosition(Game_Config.UI_tilesToWorld(3), Game_Config.UI_tilesToWorld(16 + 2 + i))
            })
        }
    }

}