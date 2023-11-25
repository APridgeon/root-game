import { Position } from "../plant/plantData";
import TreeComponents, { BranchFrames, FrameType, LeafFrames } from "./treeTiles";

type TreeComponent<FrameType> = {
    pos: Position,
    frames: FrameType,
    colours: number[]
}

export default class ProceduralTree {

    _scene: Phaser.Scene;

    scale: number = 5;

    leafComponents: TreeComponent<LeafFrames>[] = [];
    branchComponents: TreeComponent<BranchFrames>[] = [];

    leafColours: number[] = [0x413452, 0x3b6e7f, 0x66ab8c];
    branchColours: number[] = [0x4a3838, 0x816976];


    constructor(scene: Phaser.Scene){

        this._scene = scene;

        this.addBranchComponent({x:34, y:10}, 2)
        this.addLeafComponent({x:34, y:10}, 1);
        this.renderComponents();


    }


    addBranchComponent(pos: Position, type: number){
        let frames = TreeComponents.BranchComponents[type];

        this.branchComponents.push({
            colours: this.branchColours,
            frames: frames,
            pos: pos
        });
    }

    addLeafComponent(pos: Position, type: number){

        let frames = TreeComponents.LeafComponents[type];

        this.leafComponents.push({
            colours: this.leafColours,
            frames: frames,
            pos: pos
        });
    }

    renderComponents(){
        this.branchComponents.forEach(comp => {
            this.renderBranchComponent(comp);
        })
        this.leafComponents.forEach(comp => {
            this.renderLeafComponent(comp);
        })

    }

    renderLeafComponent(comp: TreeComponent<LeafFrames>){
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

    renderBranchComponent(comp: TreeComponent<BranchFrames>){
        this._scene.add.image(comp.pos.x, comp.pos.y, 'trees', comp.frames.shadow)
            .setTint(comp.colours[0])
            .setOrigin(0,0)
            .setScale(this.scale);
        this._scene.add.image(comp.pos.x, comp.pos.y, 'trees', comp.frames.main)
            .setTint(comp.colours[1])
            .setOrigin(0,0)
            .setScale(this.scale);
    }


}