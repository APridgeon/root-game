import { Events } from "../events/events";
import Game_Config from "../game_config";
import { Position } from "../plant/plantData";

export default class Button {

    _scene: Phaser.Scene;

    image: Phaser.GameObjects.Image;
    pos: Position;
    offset: Position;
    imageIndex: number;

    constructor(scene: Phaser.Scene, pos: Position, imageIndex: number){
        this._scene = scene;
        this.pos = pos;
        this.imageIndex = imageIndex;

        this.createImage();
        this.setupInteraction();
        this.setupEvents();
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
            this.image.setPosition(Game_Config.UI_roundWorldToTileFactor(screenDim.x, -1) - Game_Config.UI_tilesToWorld(4), Game_Config.UI_tilesToWorld(2))
        })
    }

}