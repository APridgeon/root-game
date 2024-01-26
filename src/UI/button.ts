import { Events } from "../events/events";
import Game_Config from "../game_config";
import { Position } from "../plant/plantData";
import * as Phaser from "phaser";

export default class Button {

    _scene: Phaser.Scene;

    image: Phaser.GameObjects.Image;
    pos: Position;
    offset: Position;
    imageIndex: number;

    top: boolean;
    right: boolean;

    constructor(scene: Phaser.Scene, pos: Position, imageIndex: number){
        this._scene = scene;
        this.pos = pos;
        this.offset = {x: Game_Config.UI_roundWorldToTileFactor(this._scene.game.scale.width) - pos.x, y: Game_Config.UI_roundWorldToTileFactor(this._scene.game.scale.height) - pos.y};
        this.imageIndex = imageIndex;


        this.checkPosition();
        this.createImage();
        this.setupInteraction();
        this.setupEvents();
    }

    checkPosition(){
        // this.right = (this.pos.x > (this._scene.game.scale.width/2)) ? true : false;
        // this.top = (this.pos.y > (this._scene.game.scale.height/2)) ? false : true;
        this.top = true;
        this.right = true;
    }

    createImage(){
        this.image = this._scene.add.image(this.pos.x, this.pos.y, 'inputPrompts', this.imageIndex)
            .setOrigin(0, 0)
            .setScale(Game_Config.UI_SCALE)
            .setTint(0xffffff)
            .setInteractive();
    }

    setupInteraction(){
        this.image.on(Phaser.Input.Events.POINTER_OVER, () => {
            this.image.setTint(0xff4444);
        }, this);
        this.image.on(Phaser.Input.Events.POINTER_OUT, () => {
            this.image.setTint(0xffffff);
        }, this);
    }

    setupEvents(){

        this._scene.game.events.on(Events.screenSizeChange, (screenDim: Position) => {
            let x = (this.right) ? Game_Config.UI_roundWorldToTileFactor(screenDim.x) - this.offset.x : this.pos.x;
            let y = (this.top) ? this.pos.y : Game_Config.UI_roundWorldToTileFactor(screenDim.y) - this.offset.y;
            this.image.setPosition(x, y);
        })
    }

}