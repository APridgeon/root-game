import { Events } from "../events/events";
import gameManager from "../gameManager/gameManager";
import Game_Config from "../game_config";
import { Position } from "../plant/plantData";
import { waterStats } from "../plant/waterHandling";
import UI_TileSets from "./UI_TileSets";
import Barometer from "./barometer";
import Box from "./box";
import * as Phaser from "phaser";

export default class UI extends Phaser.Scene {

    _UIHEIGHT: integer = 150;
    _UIColor: number = 0xff0000;

    uiTileMap: Phaser.Tilemaps.Tilemap;
    uiTiles: Phaser.Tilemaps.Tileset;

    box: Box;
    barometer: Barometer;
    fullscreenButton: Phaser.GameObjects.Image;
    mouse: Phaser.GameObjects.Image;

    waterText: Phaser.GameObjects.BitmapText;
    waterRemovedText: Phaser.GameObjects.BitmapText;
    waterAddedText: Phaser.GameObjects.BitmapText;
    uiText: Phaser.GameObjects.BitmapText;
    turnNoText: Phaser.GameObjects.BitmapText;

    turnNo = 0;
    
    constructor(){
        super({key: 'UI'})
        
    }
    
    preload(){
        this.load.spritesheet('UI_tiles', 'assets/ui/GUI_1x_sliced.png', {frameWidth: 8, frameHeight: 8, spacing: 0 });
        this.load.bitmapFont({
            key: 'ant_party', 
            textureURL: 'assets/fonts/AntParty/AntParty.png', 
            fontDataURL: 'assets/fonts/AntParty/AntParty.xml'
        });
    }

    create(){

        this.uiTileMap = this.make.tilemap({tileHeight: Game_Config.UI_RES, tileWidth: Game_Config.UI_RES, height: Game_Config.MAP_SIZE.y, width: Game_Config.MAP_SIZE.x});
        this.uiTiles = this.uiTileMap.addTilesetImage('UI_tiles', 'UI_tiles', Game_Config.UI_RES, Game_Config.UI_RES, 0, 0);

        this.box = new Box(this.uiTileMap, UI_TileSets.boxStyle3, 0, this.game.scale.height-Game_Config.UI_tilesToWorld(5), Game_Config.GAMEWIDTH/Game_Config.UI_tilesToWorld(1), 5);
        
        this.barometer = new Barometer(this, this.uiTileMap, Game_Config.UI_tilesToWorld(1), this.game.scale.height-Game_Config.UI_tilesToWorld(7), 10);
        this.waterText = this.add.bitmapText(Game_Config.UI_tilesToWorld(2), this.game.scale.height - Game_Config.UI_tilesToWorld(8), 'ant_party', 'Water: ' + Game_Config.PLANT_DATA_WATER_START_LEVEL)
            .setOrigin(0,0)
            .setTint(0x0095e9)
            .setScale(Game_Config.FONT_SCALE)
            .setDepth(10);

        this.waterRemovedText = this.add.bitmapText(Game_Config.UI_tilesToWorld(2), this.game.scale.height - Game_Config.UI_tilesToWorld(9), 'ant_party', 'Water removed: ' + 0)
            .setOrigin(0,0)
            .setTint(0xff0000)
            .setScale(Game_Config.FONT_SCALE)
            .setDepth(10);

        this.waterAddedText = this.add.bitmapText(Game_Config.UI_tilesToWorld(2), this.game.scale.height - Game_Config.UI_tilesToWorld(10), 'ant_party', 'Water added: ' + 0)
            .setOrigin(0,0)
            .setTint(0x00ff00)
            .setScale(Game_Config.FONT_SCALE)
            .setDepth(10);

        this.uiText = this.add.bitmapText(Game_Config.UI_tilesToWorld(2), this.game.scale.height - Game_Config.UI_tilesToWorld(3), 'ant_party', 'WELCOME TO TAPROOT')
            .setOrigin(0,0)
            .setTint(0x000000)
            .setScale(Game_Config.FONT_SCALE)
            .setDepth(10);

        this.turnNoText = this.add.bitmapText(this.game.scale.width - Game_Config.UI_tilesToWorld(10), this.game.scale.height - Game_Config.UI_tilesToWorld(3), 'ant_party', 'Turn no: 0')
            .setOrigin(0,0)
            .setTint(0x000000)
            .setScale(Game_Config.FONT_SCALE)
            .setDepth(10);


        this.mouse = this.add.image(Game_Config.UI_tilesToWorld(20), this.game.scale.height - Game_Config.UI_tilesToWorld(3.5), 'inputPrompts', (3 * 34) + 9)
            .setOrigin(0, 0)
            .setScale(Game_Config.UI_SCALE)
            .setTint(0x000000)





        this.scene.get('main').events.on(Events.WaterText, (waterStats: waterStats) =>{
            this.waterText.setText('Water: ' + waterStats.totalWater.toString());
            this.waterRemovedText.setText('Water removed: ' + waterStats.waterRemoved);
            this.waterAddedText.setText('Water added: ' + waterStats.waterAdded);
            this.barometer.setWaterBar(waterStats.totalWater);
        })

        this.scene.get('main').events.on(Events.UpdateUIText, () => {
            this.turnNo += 1;
            this.turnNoText.setText(`Turn no: ${this.turnNo}`);

        })

        this.scene.get('main').events.on(Events.GameOver, () => {

            this.uiText.setText('GAME OVER')
                .setTint(0xff0000)
                .setDropShadow(0.5,0.5, 0x000000, 1)
                .setScale(Game_Config.FONT_SCALE * 2)
        })


        this.fullscreenButton = this.add.image(this.game.scale.width - Game_Config.UI_tilesToWorld(4), Game_Config.UI_tilesToWorld(2), 'inputPrompts', (10 * 34) + 15)
            .setOrigin(0, 0)
            .setScale(Game_Config.UI_SCALE)
            .setTint(0xffffff)
            .setInteractive();

        this.fullscreenButton.on(Phaser.Input.Events.POINTER_OVER, () => {
            this.fullscreenButton.setTint(0xff4444);
        }, this);
        this.fullscreenButton.on(Phaser.Input.Events.POINTER_OUT, () => {
            this.fullscreenButton.setTint(0xffffff);
        }, this);

        this.fullscreenButton.on(Phaser.Input.Events.POINTER_UP, function ()
        {
            let test = this as Phaser.Scene;

            if (this.scale.isFullscreen)
            {
                this.scale.stopFullscreen();
            }
            else
            {
                this.scale.startFullscreen();
            }

        }, this);


        this.cameras.main.setZoom(1);


        this.game.events.on(Events.screenSizeChange, (screenDim: Position) => {
            this.resize(screenDim);
        })

    }


    private resize(screenDim: Position){

        this.fullscreenButton
            .setPosition(Game_Config.UI_roundWorldToTileFactor(screenDim.x, -1) - Game_Config.UI_tilesToWorld(4), Game_Config.UI_tilesToWorld(2))
        this.barometer.setPosition({x: Game_Config.UI_tilesToWorld(1), y: screenDim.y - Game_Config.UI_tilesToWorld(7)});
        this.box.setPosition({x: 0, y: screenDim.y - Game_Config.UI_tilesToWorld(5)});
        this.box.SetBoxSize(Game_Config.UI_worldToTiles(screenDim.x) , 5);

        this.mouse.setPosition(Game_Config.UI_tilesToWorld(20), screenDim.y - Game_Config.UI_tilesToWorld(3.5))

        this.waterText.setPosition(Game_Config.UI_tilesToWorld(2), screenDim.y - Game_Config.UI_tilesToWorld(8));
        this.waterRemovedText.setPosition(Game_Config.UI_tilesToWorld(2), screenDim.y - Game_Config.UI_tilesToWorld(9));
        this.waterAddedText.setPosition(Game_Config.UI_tilesToWorld(2), screenDim.y - Game_Config.UI_tilesToWorld(10));
        this.uiText.setPosition(Game_Config.UI_tilesToWorld(2), screenDim.y - Game_Config.UI_tilesToWorld(3));
        this.turnNoText.setPosition(Game_Config.UI_tilesToWorld(30), screenDim.y - Game_Config.UI_tilesToWorld(3))

    }
    
    

}
