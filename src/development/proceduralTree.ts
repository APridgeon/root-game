import { Position } from "../plant/plantData";
import TreeComponents, { LeafFrames } from "./treeTiles";


type LeafComponent = {
    pos: Position,
    frames: LeafFrames,
    colours: number[]
}


export default class ProceduralTree {

    _scene: Phaser.Scene;

    leafComponents: LeafComponent[] = [];
    colours: number[] = [0x413452, 0x3b6e7f, 0x66ab8c];


    constructor(scene: Phaser.Scene){

        this._scene = scene;
        this.addComponent();
        this.renderComponents();


    }

    addComponent(){

        let pos = {x: 20, y: 20};
        let colours = [0x413452, 0x3b6e7f, 0x66ab8c];
        let frames = TreeComponents.LeafComponents[0];

        this.leafComponents.push({
            colours: colours,
            frames: frames,
            pos: pos
        });
    }

    renderComponents(){
        this.leafComponents.forEach(comp => {
            this.renderLeafComponent(comp);
        })
    }

    renderLeafComponent(comp: LeafComponent){
        this._scene.add.image(comp.pos.x, comp.pos.y, 'trees', comp.frames.bottom)
            .setTint(comp.colours[0])
            .setOrigin(0,0);
        this._scene.add.image(comp.pos.x, comp.pos.y, 'trees', comp.frames.middle)
            .setTint(comp.colours[1])
            .setOrigin(0,0);
        this._scene.add.image(comp.pos.x, comp.pos.y, 'trees', comp.frames.top)
            .setTint(comp.colours[2])
            .setOrigin(0,0);

    }


}