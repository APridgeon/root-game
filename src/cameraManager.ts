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
    
    private fog: Phaser.GameObjects.Rectangle;

    private _plantManager: PlantManager;
    private _mapManager: MapManager;

    constructor(scene: Phaser.Scene, plantManager: PlantManager, mapManager: MapManager){

        this._plantManager = plantManager;
        this._mapManager = mapManager;

        this.fog = scene.add.rectangle(0, 0, Game_Config.MAP_tilesToWorld(Game_Config.MAP_SIZE.x), Game_Config.MAP_tilesToWorld(Game_Config.MAP_SIZE.y))
            .setFillStyle(0x000000, 0.1)
            .setOrigin(0,0)
            .setVisible(false);
        
        this.cam = scene.cameras.main;
        this.cam.setBounds(Game_Config.MAP_tilesToWorld(0), Game_Config.MAP_tilesToWorld(0), Game_Config.MAP_tilesToWorld(Game_Config.MAP_SIZE.x), Game_Config.MAP_tilesToWorld(Game_Config.MAP_SIZE.y));
        this.setZoom();

        this.maskTexture = scene.add.renderTexture(0, 0, Game_Config.MAP_tilesToWorld(Game_Config.MAP_SIZE.x), Game_Config.MAP_tilesToWorld(Game_Config.MAP_SIZE.y))
            .setOrigin(0,0)
            .setVisible(true)
            .setDepth(100);
        
        
        
        this.updateMask(scene, plantManager, mapManager);
        

        this.setupDragMovement(scene);

        scene.scene.get('UI').events.on(Events.TurnConfirm, () => {
            if(!plantManager.gameOver){
                this.updateMask(scene, plantManager, mapManager);
            }
        })

        scene.events.on(Events.GameOver, () => {
            this.maskTexture.clear();
        })

        scene.game.events.on(Events.screenSizeChange, (screenDim: Position) => {
            console.log(`the camera has listened! screenDim: ${JSON.stringify(screenDim)}`);
            this.setZoom();
            this.updateMask(scene, plantManager, mapManager);

            this.cam.centerOn(Game_Config.MAP_tilesToWorld(plantManager.userPlant.startPos.x), Game_Config.MAP_tilesToWorld(plantManager.userPlant.startPos.y));
        })

        this.cam.centerOn(Game_Config.MAP_tilesToWorld(plantManager.userPlant.startPos.x), Game_Config.MAP_tilesToWorld(plantManager.userPlant.startPos.y));

    }

    private setZoom(){
        if(gameManager.mobile){
            this.cam.setZoom(1.5);
        } else {
            this.cam.setZoom(1);
        }
    }


    private updateMask(scene: Phaser.Scene, plantManager: PlantManager, mapManager: MapManager){
        let circleArray: Phaser.GameObjects.Image[] = [];
            

        //clear maskTexture
        this.maskTexture.clear();


        //fog
        this.maskTexture.draw(this.fog, 0, 0);

        //draw land cover
        let land = this._mapManager.mapDisplay.tilemap.getLayer('landBeforeHoles');
        this.maskTexture.draw(land.tilemapLayer,  0, 0);

        //draw circlemask for each root segment
        plantManager.userPlant.rootData.forEach(pos => {
            let tile = plantManager.plantDisplay.plantTileLayer.getTileAt(pos.x, pos.y, true);
            let circ = scene.add.image(tile.getCenterX(), tile.getCenterY(), 'circleMask')
                .setVisible(false)
                .setScale(Game_Config.MAP_SCALE)
                .setAlpha(1);
            this.maskTexture.erase(circ, circ.x , circ.y );
            circleArray.push(circ);
        })

        //draw circle mask for aerial growth
        let buds = plantManager.plantDisplay.plantTrees.get(plantManager.userPlant).buds
        for(let i = 0; i < buds.length; i += 2){
            let x = Game_Config.MAP_tilesToWorld(Game_Config.MAP_worldToTiles(buds[i].pos.x));
            let y = Game_Config.MAP_tilesToWorld(Game_Config.MAP_worldToTiles(buds[i].pos.y));

            let circ = scene.add.image(x, y, 'circleMask')
                .setVisible(false)
                .setScale(Game_Config.MAP_SCALE)
                .setAlpha(1);
            this.maskTexture.erase(circ, circ.x , circ.y );
            circleArray.push(circ);
        };

        //draw masks for anim decorations
        mapManager.mapDisplay.mapAnimFX.forEach(anim => {
            let circ = scene.add.image(anim.image.getCenter().x, anim.image.getCenter().y, 'smallMask').setVisible(false).setScale(Game_Config.MAP_SCALE);
            this.maskTexture.erase(circ, circ.x, circ.y);
            circleArray.push(circ);
        })



        //destroy circle array objects
        circleArray.forEach(circ => {
            circ.destroy();
        })
    }

    private setupDragMovement(scene: Phaser.Scene){

        scene.input.on("pointermove", p => {
            if (!p.isDown) return;

            let absLengthX = (p.x - p.prevPosition.x) / this.cam.zoom;
            let absLengthY = (p.y - p.prevPosition.y) /  this.cam.zoom;
        
            this.cam.scrollX -=  Math.ceil(absLengthX/Game_Config.MAP_SCALE) * Game_Config.MAP_SCALE;
            this.cam.scrollY -=  Math.ceil(absLengthY/Game_Config.MAP_SCALE) * Game_Config.MAP_SCALE;

        })

    }


}








