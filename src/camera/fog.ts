import Phaser from 'phaser';
import UI from '../UI/UI_scene';
import Game_Config from '../game_config';
import PlantManager from '../plant/plantManager';
import MapManager from '../map/mapManager';
import { Events } from "./../events/events";
import { Position } from '../plant/plantData';

export default class Fog {

  fog: Phaser.GameObjects.Rectangle;
  fogMask: Phaser.GameObjects.RenderTexture;
  maskGOarray: Phaser.GameObjects.GameObject[] = [];

  constructor(
    scene: Phaser.Scene,
    plantManager: PlantManager,
    mapManager: MapManager
  ) {

    this.fogMask = scene.make.renderTexture({
      x: 0, y: 0,
      width: Game_Config.MAP_tilesToWorld(Game_Config.MAP_SIZE.x),
      height: Game_Config.MAP_tilesToWorld(Game_Config.MAP_SIZE.y)
    },
      false
    )
      .setOrigin(0, 0)
      .fill(0x00, 0.5)
      .render() as any as Phaser.GameObjects.RenderTexture

    this.fog = scene.add.rectangle(
      0, 0,
      Game_Config.MAP_tilesToWorld(Game_Config.MAP_SIZE.x),
      Game_Config.MAP_tilesToWorld(Game_Config.MAP_SIZE.y),
      0x000000,
      1
    )
      .setOrigin(0, 0)
      .setDepth(500)
      .enableFilters()

    this.fog.filters.internal.addMask(
      this.fogMask, false
    )

    this.updateMask(scene, plantManager, mapManager);
    this.setupFogEvents(scene, plantManager, mapManager);

  }

  private updateMask(scene: Phaser.Scene, plantManager: PlantManager, mapManager: MapManager) {
    this.maskGOarray.forEach(GO => {
      GO.destroy();
    })

    //reset fogMask
    this.fogMask
      .clear()
      .fill(0x00, 0.5);

    //draw land cover
    const land = mapManager.mapDisplay.tilemap.getLayer('landBeforeHoles');

    this.fogMask.draw(land.tilemapLayer, 0, 0, 1);


    ////draw circlemask for each root segment
    plantManager.userPlant.rootData.forEach(pos => {
      const tile = plantManager.plantDisplay.plantTileLayer.getTileAt(pos.x, pos.y, true);
      const circ = scene.make.image({
        x: tile.getCenterX(),
        y: tile.getCenterY(), key: 'circleMask'
      }, false)
        .setScale(Game_Config.MAP_SCALE)
        .setAlpha(1);
      this.fogMask.erase(circ)
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
      this.fogMask.erase(circ)
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

      this.fogMask.erase(circ);
      this.maskGOarray.push(circ);
    })

    this.fogMask.render()

  }

  setupFogEvents(
    scene: Phaser.Scene,
    plantManager: PlantManager,
    mapManager: MapManager
  ) {

    scene.scene.get('UI').events.on(Events.TurnConfirm, () => {
      if (!plantManager.gameOver) {
        this.updateMask(scene, plantManager, mapManager);
      }
    })

    scene.events.on(Events.GameOver, () => {
      this.fog.destroy();
    })

    scene.game.events.on(Events.screenSizeChange, (screenDim: Position) => {
      this.updateMask(scene, plantManager, mapManager);
    })
  }


}
