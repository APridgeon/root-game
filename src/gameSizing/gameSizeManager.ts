import { Events } from "../events/events";
import { Position } from "../plant/plantData";


export default class GameSizeManager {

    game: Phaser.Game;
    screenDim: Position;

    constructor(game: Phaser.Game, screenDim: Position){

        this.game = game;
        this.screenDim = screenDim;

        window.addEventListener("resize", () => {
            console.log("resized!");
            this.updateScreenSize();
        })
    }

    public updateScreenSize(){
        this.screenDim = {x: screen.availWidth - 100, y: screen.availHeight -100};
        this.game.scale.resize(this.screenDim.x, this.screenDim.y);
        this.game.events.emit(Events.screenSizeChange, this.screenDim);
    }

}