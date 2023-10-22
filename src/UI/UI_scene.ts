import { Events } from "../events/events";
import Game_Config from "../game_config";
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

    fullscreenButton: Phaser.GameObjects.Image;

    turnNo = 0;
    
    constructor(){
        super({key: 'UI', active: true})
        
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

        this.uiTileMap = this.make.tilemap({tileHeight: Game_Config.UI_RES, tileWidth: Game_Config.UI_RES, height: this.game.scale.height /Game_Config.UI_tilesToWorld(1), width: this.game.scale.width /Game_Config.UI_tilesToWorld(1)});
        this.uiTiles = this.uiTileMap.addTilesetImage('UI_tiles', 'UI_tiles', Game_Config.UI_RES, Game_Config.UI_RES, 0, 0);

        new Box(this.uiTileMap, UI_TileSets.boxStyle3, 0, this.game.scale.height-Game_Config.UI_tilesToWorld(5), Game_Config.GAMEWIDTH/Game_Config.UI_tilesToWorld(1), 5);
        
        let barometer = new Barometer(this, this.uiTileMap, Game_Config.UI_tilesToWorld(1), this.game.scale.height-Game_Config.UI_tilesToWorld(7), 10);
        let waterText = this.add.bitmapText(Game_Config.UI_tilesToWorld(2), this.game.scale.height - Game_Config.UI_tilesToWorld(8), 'ant_party', 'Water: ' + Game_Config.PLANT_DATA_WATER_START_LEVEL)
            .setOrigin(0,0)
            .setTint(0x0095e9)
            .setScale(Game_Config.FONT_SCALE)
            .setDepth(10);

        let waterRemovedText = this.add.bitmapText(Game_Config.UI_tilesToWorld(2), this.game.scale.height - Game_Config.UI_tilesToWorld(9), 'ant_party', 'Water removed: ' + 0)
            .setOrigin(0,0)
            .setTint(0xff0000)
            .setScale(Game_Config.FONT_SCALE)
            .setDepth(10);

        let waterAddedText = this.add.bitmapText(Game_Config.UI_tilesToWorld(2), this.game.scale.height - Game_Config.UI_tilesToWorld(10), 'ant_party', 'Water added: ' + 0)
            .setOrigin(0,0)
            .setTint(0x00ff00)
            .setScale(Game_Config.FONT_SCALE)
            .setDepth(10);

        let uiText = this.add.bitmapText(Game_Config.UI_tilesToWorld(2), this.game.scale.height - Game_Config.UI_tilesToWorld(3), 'ant_party', 'WELCOME TO TAPROOT')
            .setOrigin(0,0)
            .setTint(0x000000)
            .setScale(Game_Config.FONT_SCALE)
            .setDepth(10);

        let turnNoText = this.add.bitmapText(this.game.scale.width - Game_Config.UI_tilesToWorld(10), this.game.scale.height - Game_Config.UI_tilesToWorld(3), 'ant_party', 'Turn no: 0')
            .setOrigin(0,0)
            .setTint(0x000000)
            .setScale(Game_Config.FONT_SCALE)
            .setDepth(10);


        this.add.image(Game_Config.UI_tilesToWorld(20), this.game.scale.height - Game_Config.UI_tilesToWorld(3.5), 'inputPrompts', (3 * 34) + 9)
            .setOrigin(0, 0)
            .setScale(2)
            .setTint(0x000000)





        this.scene.get('main').events.on(Events.WaterText, (waterStats: waterStats) =>{
            waterText.setText('Water: ' + waterStats.totalWater.toString());
            waterRemovedText.setText('Water removed: ' + waterStats.waterRemoved);
            waterAddedText.setText('Water added: ' + waterStats.waterAdded);
            barometer.setWaterBar(waterStats.totalWater);
        })

        this.scene.get('main').events.on(Events.UpdateUIText, () => {
            this.turnNo += 1;
            turnNoText.setText(`Turn no: ${this.turnNo}`);

        })

        this.scene.get('main').events.on(Events.GameOver, () => {

            uiText.setText('GAME OVER')
                .setTint(0xff0000)
                .setDropShadow(0.5,0.5, 0x000000, 1)
                .setScale(Game_Config.FONT_SCALE * 2)
        })


        this.fullscreenButton = this.add.image(this.game.scale.width - Game_Config.UI_tilesToWorld(4), Game_Config.UI_tilesToWorld(2), 'inputPrompts', (10 * 34) + 15)
            .setOrigin(0, 0)
            .setScale(2)
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



    }
    
    

}
