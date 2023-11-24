import { Position } from "../plant/plantData";
import TreeComponents, { BranchFrames, LeafFrames } from "./treeTiles";


type LeafComponent = {
    pos: Position,
    frames: LeafFrames | BranchFrames,
    colours: number[]
}


export default class ProceduralTree {

    _scene: Phaser.Scene;

    scale: number = 5;

    leafComponents: LeafComponent[] = [];
    colours: number[] = [0x413452, 0x3b6e7f, 0x66ab8c];


    constructor(scene: Phaser.Scene){

        this._scene = scene;
        this.addComponent({x:20, y:20}, 4);
        this.addComponent({x:34, y:10}, 2);
        this.renderComponents();


    }

    addComponent(pos: Position, type: number){

        let colours = [0x413452, 0x3b6e7f, 0x66ab8c];
        let frames = TreeComponents.LeafComponents[type];

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
            .setOrigin(0,0)
            .setScale(this.scale);
        this._scene.add.image(comp.pos.x, comp.pos.y, 'trees', comp.frames.middle)
            .setTint(comp.colours[1])
            .setOrigin(0,0)
            .setScale(this.scale);
        this._scene.add.image(comp.pos.x, comp.pos.y, 'trees', comp.frames.top)
            .setTint(comp.colours[2])
            .setOrigin(0,0)
            .setScale(this.scale);

    }


}