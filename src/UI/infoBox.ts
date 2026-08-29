import Main from "../game"
import TextBox from "./boxes/textBox"
import UI from "./UI_scene"
import { Colours } from "./UI_scene"
import { BoxTiles } from "./UI_TileSets"
import { Events } from "../events/events"

export default class InfoBox extends TextBox {

  constructor(
    text: string,
    scene: UI,
    tilemap: Phaser.Tilemaps.Tilemap,
    boxStyle: Map<BoxTiles, integer>,
    x: number, y: number,
    width: number, height: number
  ) {
    super(text, scene, tilemap, boxStyle, x, y, width, height)

    // this.text.postFX.addGlow()

    scene.tweens.add({
      targets: this.text,
      alpha: 0,
      duration: 1000,
      ease: 'Linear',
      yoyo: true,
      repeat: -1
    });

    this._scene.scene.get('main').events.on(Events.GameOver, () => {
      this.text.setTint(Colours.RED)
        .setDropShadow(0.5, 0.5, 0x000000, 1)
        .setText('GAME OVER');
    })
  }


}
