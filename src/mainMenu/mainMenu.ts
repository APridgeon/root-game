import * as Phaser from 'phaser';
import Game_Config from '../game_config';
import Box from '../UI/box';
import UI_TileSets from '../UI/UI_TileSets';
import { Position } from '../plant/plantData';
import { Events } from '../events/events';
import SkyManager from '../map/display/skyManager';
import TimeOfDayManager, { TimeOfDay } from '../general/timeOfDay';
import TitleText from './titleText';
import PlayerChoices from './playerChoices';

export default class MainMenu extends Phaser.Scene {

    tileMap: Phaser.Tilemaps.Tilemap;
    tiles: Phaser.Tilemaps.Tileset;
    skyLayer: Phaser.Tilemaps.TilemapLayer;

    title: TitleText;

    ev: Phaser.Events.EventEmitter;

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
        this.tileMap = this.make.tilemap({tileHeight: Game_Config.UI_RES, tileWidth: Game_Config.UI_RES, height: Game_Config.MAP_SIZE.y, width: Game_Config.MAP_SIZE.x});
        this.tiles = this.tileMap.addTilesetImage('UI_tiles', 'UI_tiles', Game_Config.UI_RES, Game_Config.UI_RES, 0, 0);

        new TimeOfDayManager(this);
        let skyManager = new SkyManager(this.tileMap, this);
        skyManager._currentTileLayer.y += (Game_Config.UI_tilesToWorld(7))
        skyManager._newTileLayer.y += (Game_Config.UI_tilesToWorld(7))

        let title = new TitleText(this);
        this.title = title;
        new PlayerChoices(this);

        this.input.on(Phaser.Input.Events.POINTER_DOWN, () => {
            title.clickEvent.removeAllListeners();

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