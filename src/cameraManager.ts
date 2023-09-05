import { Events } from "./events/events";
import Game_Config from "./game_config";
import MapManager from "./map/mapManager";
import PlantManager from "./plant/plantManager";
import * as Phaser from "phaser";

export default class CameraManager {


    cam: Phaser.Cameras.Scene2D.Camera;
    maskTexture: Phaser.GameObjects.RenderTexture;
    skyMask: Phaser.GameObjects.Rectangle;

    constructor(scene: Phaser.Scene, plantManager: PlantManager, mapManager: MapManager){

        
        this.cam = scene.cameras.main;
        this.cam.setBounds(Game_Config.MAP_tilesToWorld(0), Game_Config.MAP_tilesToWorld(0), Game_Config.MAP_tilesToWorld(Game_Config.MAP_SIZE.x), Game_Config.MAP_tilesToWorld(Game_Config.MAP_SIZE.y));
        this.setupDragMovement(scene);

        this.maskTexture = scene.add.renderTexture(0, 0, Game_Config.MAP_SCALE*Game_Config.MAP_RES*Game_Config.MAP_SIZE.x, Game_Config.MAP_SCALE*Game_Config.MAP_RES*Game_Config.MAP_SIZE.y)
            .setOrigin(0,0)
            .setVisible(false);
        
        this.skyMask = scene.add.rectangle(0, 0, Game_Config.MAP_SIZE.x*Game_Config.MAP_RES*Game_Config.MAP_SCALE, (Game_Config.MAP_GROUND_LEVEL)*Game_Config.MAP_RES*Game_Config.MAP_SCALE, 0x000000)
            .setVisible(false)
            .setAlpha(0.95)
            .setOrigin(0);
        
        // this.updateMask(scene, plantManager, mapManager);
        
        scene.scene.get('UI').events.on(Events.TurnConfirm, () => {
            this.cam.clearMask(true);
            if(!plantManager.gameOver){
                // this.updateMask(scene, plantManager, mapManager);
            }
        })

    }



    private updateMask(scene: Phaser.Scene, plantManager: PlantManager, mapManager: MapManager){
        let circleArray: Phaser.GameObjects.Image[] = [];
            
        //clear maskTexture
        this.maskTexture.clear();

        //draw blank cover
        this.maskTexture.draw(this.skyMask);

        //draw circlemask for each root segment
        plantManager.userPlant.__rootData.forEach(pos => {
            let tile = plantManager.plantDisplay.plantTileLayer.getTileAt(pos.x, pos.y, true);
            let circ = scene.add.image(tile.getCenterX(), tile.getCenterY(), 'circleMask').setVisible(false).setScale(Game_Config.MAP_SCALE);
            this.maskTexture.draw(circ);
            circleArray.push(circ);
        })

        //draw masks for anim decorations
        mapManager.mapDisplay.mapAnimFX.forEach(anim => {
            let circ = scene.add.image(anim.image.getCenter().x, anim.image.getCenter().y, 'smallMask').setVisible(false).setScale(Game_Config.MAP_SCALE);
            this.maskTexture.draw(circ);
            circleArray.push(circ);

        })

        //set as the camera mask
        this.cam.setMask(new Phaser.Display.Masks.BitmapMask(scene, this.maskTexture), false);

        //destroy circle array objects
        circleArray.forEach(circ => {
            circ.destroy();
        })
    }

    private setupDragMovement(scene: Phaser.Scene){
        let cam = this.cam;

        scene.input.on("pointermove", function (p) {
            if (!p.isDown) return;
        
            cam.scrollX -= (p.x - p.prevPosition.x) / cam.zoom;
            cam.scrollY -= (p.y - p.prevPosition.y) /  cam.zoom;
        });
    }


}








