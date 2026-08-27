import { Events } from "../events/events";
import gameManager from "../gameManager/gameManager";
import Game_Config from "../game_config";
import { Position } from "../plant/plantData";
import { WaterStats } from "../plant/waterHandling";
import UI_TileSets from "./UI_TileSets";
import Barometer from "./barometer";
import Box from "./boxes/box";
import * as Phaser from "phaser";
import Button from "./button";
import TextBox from "./boxes/textBox";
import GuideManager from "./guideManager";

export default class UI extends Phaser.Scene {

  _UIHEIGHT: integer = 150;
  _UIColor: number = 0xff0000;

  uiTileMap: Phaser.Tilemaps.Tilemap;
  uiTiles: Phaser.Tilemaps.Tileset;

  box: Box;
  barometer: Barometer;
  fullscreenButton: Button;
  soundButton: Button;
  uiText: Phaser.GameObjects.BitmapText;
  waterTextObjects: Record<string, Phaser.GameObjects.BitmapText> = {};

  turnNo = 0;

  constructor() {
    super({ key: 'UI' })
  }

  preload() {
    this.load.spritesheet('UI_tiles', 'assets/ui/GUI_1x_sliced.png', { frameWidth: 8, frameHeight: 8, spacing: 0 });
    this.load.bitmapFont({
      key: 'ant_party',
      textureURL: 'assets/fonts/AntParty/AntParty.png',
      fontDataURL: 'assets/fonts/AntParty/AntParty.xml'
    });
  }

  create() {

    this.uiTileMap = this.make.tilemap({
      tileHeight: Game_Config.UI_RES,
      tileWidth: Game_Config.UI_RES,
      height: Game_Config.MAP_SIZE.y,
      width: Game_Config.MAP_SIZE.x
    });

    this.uiTiles = this.uiTileMap.addTilesetImage(
      'UI_tiles',
      'UI_tiles',
      Game_Config.UI_RES,
      Game_Config.UI_RES,
      0,
      0
    );

    const welcomeBox = new TextBox(
      "WELCOME TO TAPROOT!",
      this,
      this.uiTileMap,
      UI_TileSets.boxStyle3,
      0,
      -Game_Config.UI_tilesToWorld(5),
      20, 5
    )

    const turnBox = new TextBox(
      'Turn no: 0',
      this, this.uiTileMap,
      UI_TileSets.boxStyle3,
      gameManager.mobile ? 0 : -Game_Config.UI_tilesToWorld(8),
      gameManager.mobile ? 0 : -Game_Config.UI_tilesToWorld(5),
      8, 5
    );

    new GuideManager(this);

    this.barometer = new Barometer(this, this.uiTileMap, Game_Config.UI_tilesToWorld(1), this.game.scale.height - Game_Config.UI_tilesToWorld(7), 10);

    const waterTextContext: { key: string, text: string, colour: number }[] = [
      {
        key: 'water level',
        text: 'Water: ' + Game_Config.PLANT_DATA_WATER_START_LEVEL,
        colour: 0x0095e9
      },
      {
        key: 'water removed',
        text: 'Water removed: ' + 0,
        colour: 0xff0000
      },
      {
        key: 'water added',
        text: 'Water added: ' + 0,
        colour: 0x00ff00
      },
    ]

    waterTextContext.forEach((context, i) => {
      const waterTextObject = this.add.bitmapText(
        Game_Config.UI_tilesToWorld(2),
        this.game.scale.height - Game_Config.UI_tilesToWorld(10 - i),
        'ant_party',
        context.text
      )
        .setOrigin(0, 0)
        .setTint(context.colour)
        .setScale(Game_Config.FONT_SCALE)
        .setDepth(10);

      this.waterTextObjects[context.key] = waterTextObject

    })


    this.scene.get('main').events.on(Events.WaterText, (waterStats: WaterStats) => {
      this.waterTextObjects['water level'].setText('Water: ' + waterStats.totalWater.toString())
      this.waterTextObjects['water removed'].setText('Water removed: ' + waterStats.waterRemoved)
      this.waterTextObjects['water added'].setText('Water added: ' + waterStats.waterAdded)
      this.barometer.setWaterBar(waterStats.totalWater);
    })

    this.scene.get('main').events.on(Events.UpdateUIText, () => {
      this.turnNo += 1;
      turnBox.setText(`Turn no: ${this.turnNo}`)
    })

    this.scene.get('main').events.on(Events.GameOver, () => {

      welcomeBox.text.setTint(0xff0000)
        .setDropShadow(0.5, 0.5, 0x000000, 1)
        .setScale(Game_Config.FONT_SCALE * 2)
      welcomeBox.setText('GAME OVER');
    })

    this.soundButton = new Button(this, { x: Game_Config.UI_roundWorldToTileFactor(this.game.scale.width) - Game_Config.UI_tilesToWorld(7), y: Game_Config.UI_tilesToWorld(2) }, (24 * 34) + 3);
    this.soundButton.image.on(Phaser.Input.Events.POINTER_UP, () => {
      this.game.events.emit(Events.soundToggle);
    })

    this.fullscreenButton = new Button(this, { x: Game_Config.UI_roundWorldToTileFactor(this.game.scale.width) - Game_Config.UI_tilesToWorld(4), y: Game_Config.UI_tilesToWorld(2) }, (10 * 34) + 15);
    this.fullscreenButton.image.on(Phaser.Input.Events.POINTER_UP, function () {
      if (this.scale.isFullscreen) {
        this.scale.stopFullscreen();
      }
      else {
        this.scale.startFullscreen();
      }
    }, this);


    this.cameras.main.setZoom(1);


    this.game.events.on(Events.screenSizeChange, (screenDim: Position) => {
      this.resize(screenDim);
    })

  }

  private resize(screenDim: Position) {
    this.barometer.setPosition({ x: Game_Config.UI_tilesToWorld(1), y: screenDim.y - Game_Config.UI_tilesToWorld(7) });
    this.waterTextObjects['water level'].setPosition(Game_Config.UI_tilesToWorld(2), screenDim.y - Game_Config.UI_tilesToWorld(8));
    this.waterTextObjects['water removed'].setPosition(Game_Config.UI_tilesToWorld(2), screenDim.y - Game_Config.UI_tilesToWorld(9));
    this.waterTextObjects['water added'].setPosition(Game_Config.UI_tilesToWorld(2), screenDim.y - Game_Config.UI_tilesToWorld(10));
  }

}
