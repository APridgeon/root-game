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

        this.updateScreenSize();
        this.setupFullScreen();
    }

    public updateScreenSize(){
        
        
        if(this.game.scale.isFullscreen) {
            this.screenDim = {x: window.innerWidth, y: window.innerHeight};
            console.log(`
                screen avail: ${screen.availWidth}, ${screen.availHeight} \n
                screen: ${screen.width}, ${screen.height} \n
                window inner: ${window.innerWidth}, ${window.innerHeight} \n
                window outer: ${window.outerWidth}, ${window.outerHeight} \n
            `)
        } else if(!gameManager.mobile){
            this.screenDim = {x: 800, y: 600};
        } else if(gameManager.mobile){
            this.screenDim = {x: screen.availWidth - 100 , y: screen.availHeight - 100};
        }

        this.game.scale.resize(this.screenDim.x, this.screenDim.y);
        this.game.events.emit(Events.screenSizeChange, this.screenDim);
    }

    private setupFullScreen(){

        this.game.scale.on('enterfullscreen', () => {
            this.updateScreenSize();
        })
        this.game.scale.on('leavefullscreen', () => {
            this.updateScreenSize();
        })
    }

}