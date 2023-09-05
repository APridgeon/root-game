import Game_Config from "../game_config";
import { Position } from "../plant/plantData";

class PointerCrosshair {

    private _scene: Phaser.Scene;

    private image: Phaser.GameObjects.Image;

    constructor(scene: Phaser.Scene){

        this._scene = scene;

        this.image = this._scene.add.image(220, 220, 'inputPrompts', (24 * 34) + 1)
            .setOrigin(0.5, 0.5)
            .setScale(2)
            .setTint(0xffffff)
            .setAlpha(0.8)
            .setDepth(10);

        this._scene.time.addEvent({
            delay: 250,
            loop: true,
            callback: () => {
                let newSprite = (this.image.frame.name === ((24 * 34) + 1)) ? (24 * 34) + 0 : (24 * 34) + 1;
                this.image.setFrame(newSprite);
            }
        })

        this._scene.input.on('pointermove', (p: Phaser.Input.Pointer, go: Phaser.GameObjects.GameObject[]) => {

            let pointerTileCo: Position = {x: Game_Config.MAP_worldToTiles(p.worldX), y: Game_Config.MAP_worldToTiles(p.worldY)};
            let imCo: Position = {x: Game_Config.MAP_tilesToWorld(pointerTileCo.x) + 8, y: Game_Config.MAP_tilesToWorld(pointerTileCo.y) + 8};

            this.image.setPosition(imCo.x, imCo.y);

        })

    }

}

export default PointerCrosshair;