import * as Phaser from 'phaser';
import UI from "../UI/UI_scene";
import Main from "../game";
import Game_Config from "../game_config";
import { Position } from "../plant/plantData";
import GameSizeManager from '../gameSizing/gameSizeManager';
import MainMenu from '../mainMenu/mainMenu';
import DevScene from '../development/devScene';
import PixelatedFX from '../development/pixelatedFX';


class GameManager {

    mobile: boolean;

    game: Phaser.Game;
    gameSizeManager: GameSizeManager;


    constructor(){

        this.mobile = (screen.width < 600 || screen.height < 600) ? true : false;        
        let screenDim = this.mobile ? {x: screen.availWidth-100, y: screen.availHeight-100} : {x: 800, y: 600} ;
        


        const config = {
            type: Phaser.WEBGL,
            backgroundColor: '#ffffff',
            width: screenDim.x,
            height: screenDim.y,
            scene: [DevScene, MainMenu, Main, UI],
            pipeline: {'PixelatedFX': PixelatedFX},
            pixelArt: true,
            scale: {
                parent: 'game',
                mode: Phaser.Scale.NONE
            }
        };

        this.game = new Phaser.Game(config);

        this.game.events.on(Phaser.Core.Events.READY, () => {
            console.log("Loaded!");

            this.gameSizeManager = new GameSizeManager(this.game, screenDim);
        })

    }


}

let gameManager = new GameManager();

export default gameManager;