import * as Phaser from 'phaser';
import UI from "../UI/UI_scene";
import Main from "../game";
import Game_Config from "../game_config";
import { Position } from "../plant/plantData";
import GameSizeManager from '../gameSizing/gameSizeManager';


class GameManager {

    screenDim: Position;
    mobile: boolean;

    game: Phaser.Game;
    gameSizeManager: GameSizeManager;


    constructor(){

        this.mobile = (screen.width < 600 || screen.height < 600) ? true : false;        
        this.screenDim = this.mobile ? {x: screen.availWidth-20, y: screen.availHeight-20} : {x: 800, y: 600} ;
        


        const config = {
            type: Phaser.AUTO,
            backgroundColor: '#ffffff',
            width: this.screenDim.x,
            height: this.screenDim.y,
            scene: [Main, UI],
            pixelArt: true,
            scale: {
                parent: 'game',
                mode: Phaser.Scale.NONE
            }
        };

        this.game = new Phaser.Game(config);


    }


}

let gameManager = new GameManager();

export default gameManager;