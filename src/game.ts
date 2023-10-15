import * as Phaser from 'phaser';
import MapManager from './map/mapManager';
import Perlin from 'phaser3-rex-plugins/plugins/perlin.js';
import PlantManager from './plant/plantManager';
import InputHandler from './player/userInput';
import UI from './UI/UI_scene';
import CameraManager from './cameraManager';
import TurnHandler from './player/turnHandler';
import Game_Config from './game_config';
import TimeOfDayManager from './general/timeOfDay';
import SoundManager from './sound/SoundManager';

export default class Main extends Phaser.Scene
{

    timeOfDayManager: TimeOfDayManager;
    noise: Perlin;
    mapManager: MapManager;
    updateAnimTime: number = 150;


    constructor ()
    {
        super('main');
    }

    preload ()
    {
        this.load.image('plantTiles', 'assets/PlantTiles.png');
        this.load.spritesheet('inputPrompts', 'assets/kenney_1bit_input.png', {frameWidth: 16, frameHeight: 16, startFrame: 0, spacing: 1});

        this.load.spritesheet('plantTilesSpriteSheet', 'assets/PlantTiles.png', {frameWidth: 8, frameHeight: 8, startFrame: 0});

        this.load.image('soil', 'assets/soil2.png');
        this.load.image('sky', 'assets/skies/night.png');
        this.load.image('sky-dawn', 'assets/skies/dawn.png');
        this.load.image('sky-dusk', 'assets/skies/midday.png');
        this.load.image('sky-noon', 'assets/skies/noon.png');
        this.load.image('sky-sunset', 'assets/skies/sunset.png');
        this.load.image('sky-night', 'assets/skies/night.png');
        this.load.image('circleMask', 'assets/circleMask.png');
        this.load.image('smallMask', 'assets/smallMask.png');
        this.load.image('clouds', 'assets/clouds.png');


    }

    create ()
    {

        this.timeOfDayManager = new TimeOfDayManager(this);
        this.noise = new Perlin(Math.random());

        this.mapManager = new MapManager(this, this.noise);
        let plantManager = new PlantManager(this, this.mapManager);


        new InputHandler(this, plantManager, this.mapManager);
        new TurnHandler(this, plantManager, this.mapManager);
        new CameraManager(this, plantManager, this.mapManager);

        new SoundManager(this);

        this.mapManager.mapDisplay.updateRuleTileMap();
    }

}




const config = {
    type: Phaser.AUTO,
    backgroundColor: '#ffffff',
    width: Game_Config.GAMEWIDTH,
    height: Game_Config.GAMEHEIGHT,
    scene: [Main, UI],
    pixelArt: true,
    parent: 'game'
};

const game = new Phaser.Game(config);

//'#ead4aa'