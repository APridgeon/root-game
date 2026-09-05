import { Events } from "./../events/events";
import gameManager from "./../gameManager/gameManager";
import Game_Config from "./../game_config";
import MapManager from "./../map/mapManager";
import { Position } from "./../plant/plantData";
import PlantManager from "./../plant/plantManager";
import * as Phaser from "phaser";
import Fog from "./fog";


export default class CameraManager {


  cam: Phaser.Cameras.Scene2D.Camera;
  private _plantManager: PlantManager;
  private _mapManager: MapManager;

  constructor(scene: Phaser.Scene, plantManager: PlantManager, mapManager: MapManager) {

    this._plantManager = plantManager;
    this._mapManager = mapManager;

    new Fog(scene, plantManager, mapManager)

    this.cam = scene.cameras.main;
    this.cam.setBounds(Game_Config.MAP_tilesToWorld(0), Game_Config.MAP_tilesToWorld(0), Game_Config.MAP_tilesToWorld(Game_Config.MAP_SIZE.x), Game_Config.MAP_tilesToWorld(Game_Config.MAP_SIZE.y));
    this.setZoom();


    this.setupDragMovement(scene);

    scene.game.events.on(Events.screenSizeChange, (screenDim: Position) => {
      console.log(`the camera has listened! screenDim: ${JSON.stringify(screenDim)}`);
      this.setZoom();
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








