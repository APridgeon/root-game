import * as Phaser from 'phaser';
import Game_Config from '../game_config';
import Box from '../UI/box';
import UI_TileSets from '../UI/UI_TileSets';
import { Position } from '../plant/plantData';

export default class MainMenu extends Phaser.Scene {

    tileMap: Phaser.Tilemaps.Tilemap;
    tiles: Phaser.Tilemaps.Tileset;
    skyLayer: Phaser.Tilemaps.TilemapLayer;

    constructor(){
        super({key: 'MainMenu'});
    }

    preload(){
        this.load.bitmapFont({
            key: 'ant_party', 
            textureURL: 'assets/fonts/AntParty/AntParty.png', 
            fontDataURL: 'assets/fonts/AntParty/AntParty.xml'
        });

        this.load.image('plantTiles', 'assets/plants/rootGameAssets.png');
        this.load.image('soil', 'assets/backgrounds/soil2.png');
        this.load.image('sky', 'assets/skies/night.png');
        this.load.image('sky-dawn', 'assets/skies/dawn.png');
        this.load.image('sky-dusk', 'assets/skies/midday.png');
        this.load.image('sky-noon', 'assets/skies/noon.png');
        this.load.image('sky-sunset', 'assets/skies/sunset.png');
        this.load.image('sky-night', 'assets/skies/night.png');
        this.load.image('circleMask', 'assets/masks/circleMask.png');
        this.load.image('smallMask', 'assets/masks/smallMask.png');
        this.load.image('clouds', 'assets/skies/clouds.png');

        this.load.spritesheet('inputPrompts', 'assets/ui/kenney_1bit_input.png', {frameWidth: 16, frameHeight: 16, startFrame: 0, spacing: 1});
        this.load.spritesheet('plantTilesSpriteSheet', 'assets/plants/rootGameAssets.png', {frameWidth: 8, frameHeight: 8, startFrame: 0});        this.load.spritesheet('UI_tiles', 'assets/ui/GUI_1x_sliced.png', {frameWidth: 8, frameHeight: 8, spacing: 0 });
        this.load.spritesheet('trees','assets/plants/proceduralTrees.png', {frameWidth: 16, frameHeight: 16});
        

    }

    create(){

        this.generateBackground();
       
        this.add.bitmapText(50, 200, 'ant_party', 'Welcome to TAPROOT', 60)
            .setTint(0x000000)
            .setOrigin(0,0)
            .setDropShadow(2,2,0xffffff);


        this.input.on(Phaser.Input.Events.POINTER_DOWN, () => {
            this.scene.start('main');
            this.scene.start('UI');
            this.scene.stop();
        })
    }

    generateBackground(){
        this.tileMap = this.make.tilemap();
        let skyResolution: Position = {x: 150, y: 250};
        this.tiles = this.tileMap.addTilesetImage('sky', 'sky-dawn', skyResolution.x, skyResolution.y, 0, 0);
        this.skyLayer = this.tileMap.createBlankLayer('skyLayer', 'sky', 0, 0, Math.ceil(this.game.scale.width/skyResolution.x) * 2, 1, skyResolution.x, skyResolution.y)
            .forEachTile(tile => tile.index = 0)
            .setOrigin(0,0)
            .setScale(2);
    }

}