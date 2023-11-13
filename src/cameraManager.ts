import { Events } from "./events/events";
import Game_Config from "./game_config";
import MapManager from "./map/mapManager";
import { Position } from "./plant/plantData";
import PlantManager from "./plant/plantManager";
import * as Phaser from "phaser";

let darkTest: Phaser.GameObjects.Rectangle;

export default class CameraManager {


    cam: Phaser.Cameras.Scene2D.Camera;
    maskTexture: Phaser.GameObjects.RenderTexture;
    skyMask: Phaser.GameObjects.Rectangle;

    private screenCover: Phaser.GameObjects.Rectangle;
    private skyCover: Phaser.GameObjects.Rectangle;

    private _plantManager: PlantManager;
    private _mapManager: MapManager;

    constructor(scene: Phaser.Scene, plantManager: PlantManager, mapManager: MapManager){

        this._plantManager = plantManager;
        this._mapManager = mapManager;

        this.skyCover = scene.add.rectangle(0, 0, Game_Config.MAP_tilesToWorld(Game_Config.MAP_SIZE.x), Game_Config.MAP_tilesToWorld(Game_Config.MAP_SIZE.y))
            .setFillStyle(0x000000, 0.1)
            .setOrigin(0,0)
            .setVisible(false);

        this.screenCover = scene.add.rectangle(0, 0, scene.game.scale.width, scene.game.scale.height)
            .setFillStyle(0x000000, 1)
            .setOrigin(0,0)
            .setDepth(100);

        
        this.cam = scene.cameras.main;
        // this.cam.setBounds(Game_Config.MAP_tilesToWorld(0), Game_Config.MAP_tilesToWorld(0), Game_Config.MAP_tilesToWorld(Game_Config.MAP_SIZE.x), Game_Config.MAP_tilesToWorld(Game_Config.MAP_SIZE.y));
        

        this.maskTexture = scene.add.renderTexture(0, 0, scene.game.scale.width, scene.game.scale.height)
            .setOrigin(0,0)
            .setVisible(false);
        

        // this.maskTexture = scene.add.renderTexture(0, 0, Game_Config.MAP_SCALE*Game_Config.MAP_RES*Game_Config.MAP_SIZE.x, Game_Config.MAP_SCALE*Game_Config.MAP_RES*Game_Config.MAP_SIZE.y)
        //     .setOrigin(0,0)
        //     .setVisible(false);
        
        this.updateMask(scene, plantManager, mapManager);
        

        this.setupDragMovement(scene);

        scene.scene.get('UI').events.on(Events.TurnConfirm, () => {
            if(!plantManager.gameOver){
                this.updateMask(scene, plantManager, mapManager);
            }
        })

        scene.events.on(Events.GameOver, () => {
            this.screenCover.setVisible(false);
        })

        scene.game.events.on(Events.screenSizeChange, (screenDim: Position) => {
            console.log(`the camera has listened! screenDim: ${JSON.stringify(screenDim)}`);
            this.maskTexture.clear();
            this.screenCover.clearMask();
            // this.screenCover.setDisplaySize(screenDim.x * 0.5, screenDim.y * 0.5);
            // this.screenCover.setScale(1,1);
            // this.screenCover.setPosition(0, 0);
            this.maskTexture.resize(screenDim.x, screenDim.y);
            this.screenCover.setSize(screenDim.x, screenDim.y);
            // this.maskTexture.setScale(0.8,1);
            // this.maskTexture.setPosition(this.cam.scrollX, this.cam.scrollY)
            // this.updateMask(scene, plantManager, mapManager);
            console.log(this.maskTexture);
        })

    }


    private updateMask(scene: Phaser.Scene, plantManager: PlantManager, mapManager: MapManager){
        let circleArray: Phaser.GameObjects.Image[] = [];
            
        //clear maskTexture
        this.maskTexture.clear();
        this.screenCover.clearMask();

        //draw blank cover
        this.maskTexture.draw(this.skyCover, -this.maskTexture.x, -this.maskTexture.y);
        let land = this._mapManager.mapDisplay.tilemap.getLayer('landBeforeHoles');
        this.maskTexture.draw(land.tilemapLayer,  -this.maskTexture.x, -this.maskTexture.y);

        //draw circlemask for each root segment
        plantManager.userPlant.__rootData.forEach(pos => {
            let tile = plantManager.plantDisplay.plantTileLayer.getTileAt(pos.x, pos.y, true);
            let circ = scene.add.image(tile.getCenterX(), tile.getCenterY(), 'circleMask')
                .setVisible(false)
                .setScale(Game_Config.MAP_SCALE)
                .setAlpha(1);
            this.maskTexture.erase(circ, circ.x -this.maskTexture.x, circ.y -this.maskTexture.y);
            circleArray.push(circ);
        })

        //draw masks for anim decorations
        mapManager.mapDisplay.mapAnimFX.forEach(anim => {
            let circ = scene.add.image(anim.image.getCenter().x, anim.image.getCenter().y, 'smallMask').setVisible(false).setScale(Game_Config.MAP_SCALE);
            this.maskTexture.erase(circ, circ.x -this.maskTexture.x, circ.y -this.maskTexture.y);
            circleArray.push(circ);
        })

        //invert mask and take away from screen cover
        let invert = new Phaser.Display.Masks.BitmapMask(scene, this.maskTexture, 0, 0);
        invert.invertAlpha = false;
        this.screenCover.setMask(invert );


        //destroy circle array objects
        circleArray.forEach(circ => {
            circ.destroy();
        })
    }

    private setupDragMovement(scene: Phaser.Scene){
        let cam = this.cam;
        let rt = this.maskTexture;

        scene.input.on("pointermove", function (p) {
            if (!p.isDown) return;
        
            this.cam.scrollX -= (p.x - p.prevPosition.x) / this.cam.zoom;
            this.cam.scrollY -= (p.y - p.prevPosition.y) /  this.cam.zoom;

            this.maskTexture.setPosition(cam.scrollX, cam.scrollY);
            this.screenCover.setPosition(cam.scrollX, cam.scrollY);
            this.updateMask(scene, this._plantManager, this._mapManager);


            console.log(`camera x: ${cam.scrollX}, y: ${cam.scrollY}, width: ${cam.width}, height: ${cam.height}`);
            console.log(`screencover x: ${this.screenCover.x}, y: ${this.screenCover.y}, width: ${this.screenCover.width}, height: ${this.screenCover.height}`)
        }, this);
    }


}








