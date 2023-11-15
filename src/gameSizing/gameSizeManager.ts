import { Events } from "../events/events";
import gameManager from "../gameManager/gameManager";
import { Position } from "../plant/plantData";


export default class GameSizeManager {

    game: Phaser.Game;
    screenDim: Position;
    gameDiv: HTMLDivElement;

    constructor(game: Phaser.Game, screenDim: Position){

        this.game = game;
        this.screenDim = screenDim;

        this.game.canvas.id = "gameCanvas";
        this.gameDiv = document.getElementById("gameCanvas") as HTMLDivElement;


        window.addEventListener("resize", () => {
            this.updateScreenSize();
        })

        screen.orientation.addEventListener("change", () => {
            this.updateScreenSize();
        })

        this.setupFullScreen();
    }

    public updateScreenSize(){

        if(!gameManager.mobile && !this.game.scale.isFullscreen){
            this.screenDim = {x: 800, y: 600};
        } else {
            this.screenDim = {x: screen.availWidth - 100, y: screen.availHeight -100};
        }

        this.game.scale.resize(this.screenDim.x, this.screenDim.y);
        this.game.events.emit(Events.screenSizeChange, this.screenDim);
    }

    private setupFullScreen(){

        this.updateScreenSize();
        this.game.scale.on('enterfullscreen', () => {
            this.gameDiv.style.height = `${screen.availHeight}px`;
        })
        this.game.scale.on('leavefullscreen', () => {
            this.gameDiv.style.height = "";
            this.gameDiv.style.width = "";
        })
    }

}