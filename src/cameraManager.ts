import { text } from "stream/consumers";
import { Events } from "./events/events";
import gameManager from "./gameManager/gameManager";
import Game_Config from "./game_config";
import MapManager from "./map/mapManager";
import { Position } from "./plant/plantData";
import PlantManager from "./plant/plantManager";
import * as Phaser from "phaser";


export default class CameraManager {


  cam: Phaser.Cameras.Scene2D.Camera;
  maskTexture: Phaser.GameObjects.RenderTexture;

  maskGOarray: Phaser.GameObjects.Image[] = [];

  private fog: Phaser.GameObjects.Rectangle;
  private _plantManager: PlantManager;
  private _mapManager: MapManager;

  constructor(scene: Phaser.Scene, plantManager: PlantManager, mapManager: MapManager) {

    this._plantManager = plantManager;
    this._mapManager = mapManager;


    this.maskTexture = scene.make.renderTexture({
      x: 0, y: 0,
      width: Game_Config.MAP_tilesToWorld(Game_Config.MAP_SIZE.x),
      height: Game_Config.MAP_tilesToWorld(Game_Config.MAP_SIZE.y)
    },
      false
    )
      .setOrigin(0, 0)
      .fill(0x00, 0.5)
      .render()

    this.fog = scene.add.rectangle(
      0, 0,
      Game_Config.MAP_tilesToWorld(Game_Config.MAP_SIZE.x),
      Game_Config.MAP_tilesToWorld(Game_Config.MAP_SIZE.y),
      0x000000,
      1
    )
      .setOrigin(0, 0)
      .setDepth(500)

    this.fog.enableFilters()
    this.fog.filters.internal.addMask(this.maskTexture, false)

    this.cam = scene.cameras.main;
    this.cam.setBounds(Game_Config.MAP_tilesToWorld(0), Game_Config.MAP_tilesToWorld(0), Game_Config.MAP_tilesToWorld(Game_Config.MAP_SIZE.x), Game_Config.MAP_tilesToWorld(Game_Config.MAP_SIZE.y));
    this.setZoom();

    this.updateMask(scene, plantManager, mapManager);

    this.setupDragMovement(scene);

    scene.scene.get('UI').events.on(Events.TurnConfirm, () => {
      if (!plantManager.gameOver) {
        this.updateMask(scene, plantManager, mapManager);
      }
    })

    scene.events.on(Events.GameOver, () => {
      this.fog.destroy();
    })

    scene.game.events.on(Events.screenSizeChange, (screenDim: Position) => {
      console.log(`the camera has listened! screenDim: ${JSON.stringify(screenDim)}`);
      this.setZoom();
      this.updateMask(scene, plantManager, mapManager);

      this.cam.centerOn(Game_Config.MAP_tilesToWorld(plantManager.userPlant.startPos.x), Game_Config.MAP_tilesToWorld(plantManager.userPlant.startPos.y));
    })

    this.cam.centerOn(Game_Config.MAP_tilesToWorld(plantManager.userPlant.startPos.x), Game_Config.MAP_tilesToWorld(plantManager.userPlant.startPos.y));

  }

  private setZoom() {
    if (gameManager.mobile) {
      this.cam.setZoom(1.5);
    } else {
      this.cam.setZoom(1);
    }
  }


  private updateMask(scene: Phaser.Scene, plantManager: PlantManager, mapManager: MapManager) {
    this.maskGOarray.forEach(GO => {
      GO.destroy();
    })

    //reset maskTexture
    this.maskTexture
      .clear()
      .fill(0x00, 0.5);

    //draw land cover
    const land = this._mapManager.mapDisplay.tilemap.getLayer('landBeforeHoles');

    this.maskTexture.draw(land.tilemapLayer, 0, 0, 1);


    ////draw circlemask for each root segment
    plantManager.userPlant.rootData.forEach(pos => {
      const tile = plantManager.plantDisplay.plantTileLayer.getTileAt(pos.x, pos.y, true);
      const circ = scene.make.image({
        x: tile.getCenterX(),
        y: tile.getCenterY(), key: 'circleMask'
      }, false)
        .setScale(Game_Config.MAP_SCALE)
        .setAlpha(1);
      this.maskTexture.erase(circ)
      this.maskGOarray.push(circ)
    })

    //draw circle mask for aerial growth
    const buds = plantManager.plantDisplay.plantTrees.get(plantManager.userPlant).buds
    for (let i = 0; i < buds.length; i += 2) {
      const x = Game_Config.MAP_tilesToWorld(Game_Config.MAP_worldToTiles(buds[i].pos.x));
      const y = Game_Config.MAP_tilesToWorld(Game_Config.MAP_worldToTiles(buds[i].pos.y));

      const circ = scene.make.image({
        x: x,
        y: y, key: 'circleMask'
      }, false)
        .setScale(Game_Config.MAP_SCALE)
        .setAlpha(1);
      this.maskTexture.erase(circ)
      this.maskGOarray.push(circ)
    };

    ////draw masks for anim decorations
    mapManager.mapDisplay.mapAnimFX.forEach(anim => {
      const circ = scene.make.image({
        x: anim.image.getCenter().x,
        y: anim.image.getCenter().y,
        key: 'smallMask'
      }, false)
        .setScale(Game_Config.MAP_SCALE);

      this.maskTexture.erase(circ);
      this.maskGOarray.push(circ);
    })

    this.maskTexture.render()

  }

  private setupDragMovement(scene: Phaser.Scene) {

    scene.input.on("pointermove", p => {
      if (!p.isDown) return;

      let absLengthX = (p.x - p.prevPosition.x) / this.cam.zoom;
      let absLengthY = (p.y - p.prevPosition.y) / this.cam.zoom;

      this.cam.scrollX -= Math.ceil(absLengthX / Game_Config.MAP_SCALE) * Game_Config.MAP_SCALE;
      this.cam.scrollY -= Math.ceil(absLengthY / Game_Config.MAP_SCALE) * Game_Config.MAP_SCALE;

    })

  }


}








