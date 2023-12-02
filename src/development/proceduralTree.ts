import * as Phaser from 'phaser';
import { Position } from "../plant/plantData";
import TreeComponents, { BranchFrames, FrameType, LeafFrames } from "./treeTiles";

type TreeComponent<FrameType> = {
    pos: Position,
    frames: FrameType,
    colours: number[]
}

export default class ProceduralTree {

    _scene: Phaser.Scene;

    scale: number = 4;

    pos: Position;
    growth: Position = {x: 1, y: 1};



    leafComponents: TreeComponent<LeafFrames>[] = [];
    branchComponents: TreeComponent<BranchFrames>[] = [];

    leafColours: number[] = [0x413452, 0x3b6e7f, 0x66ab8c];
    branchColours: number[] = [0x4a3838, 0x816976];


    currentImages: Phaser.GameObjects.Image[] = [];


    constructor(scene: Phaser.Scene){

        this._scene = scene;

        this.pos = {x:  50 * this.scale, y:  25 * this.scale};
        

        this.placeComponentRandomly(FrameType.Branch);
        this.placeComponentRandomly(FrameType.Leaf);
        this.renderComponents();

        this._scene.input.on(Phaser.Input.Events.POINTER_UP, () => {
            this.grow(true, true);
            this.placeComponentRandomly(FrameType.Leaf);
            this.renderComponents();
        })

    }


    addBranchComponent(pos: Position, type: number){
        let frames = TreeComponents.BranchComponents[type];

        this.branchComponents.push({
            colours: this.branchColours,
            frames: frames,
            pos: {x: this.pos.x + (this.scale * pos.x), y: this.pos.y + (this.scale * pos.y)}
        });
    }

    addLeafComponent(pos: Position, type: number){

        let frames = TreeComponents.LeafComponents[type];

        this.leafComponents.push({
            colours: this.leafColours,
            frames: frames,
            pos: {x: this.pos.x + (this.scale * pos.x), y: this.pos.y + (this.scale * pos.y)}
        });
    }

    placeComponentRandomly(component: FrameType){

        let randomXoffset = Phaser.Math.Between(this.growth.x * -0.5, this.growth.x * 0.5) ;
        let growthYValue = Phaser.Math.Between(0, (this.growth.y - 1) * -1);
        if(component == FrameType.Leaf){
            this.addLeafComponent({x: randomXoffset, y: growthYValue}, 1);
        } else {
            this.addBranchComponent({x: randomXoffset, y: growthYValue}, 1);
        }

    }

    grow(x: boolean, y: boolean){
        let growthAmount = 2;

        if(x) this.growth = {x: this.growth.x + growthAmount, y: this.growth.y};
        if(y) this.growth = {x: this.growth.x, y: this.growth.y + growthAmount};
    }


    renderComponents(){
        this.currentImages.forEach((image, i) => {
            image.destroy();
            this.currentImages.splice(i, 1);
        })

        this.branchComponents.forEach((comp, i) => {
            this.renderBranchComponent(comp, i);
        })
        this.leafComponents.forEach((comp, i) => {
            this.renderLeafComponent(comp, i);
        })

    }

    renderLeafComponent(comp: TreeComponent<LeafFrames>, index: number){
        this.currentImages.push( this._scene.add.image(comp.pos.x, comp.pos.y, 'trees', comp.frames.bottom) 
            .setTint(comp.colours[0])
            .setOrigin(0,0)
            .setScale(this.scale)
            .setDepth(-1 * index) );
        this.currentImages.push( this._scene.add.image(comp.pos.x, comp.pos.y, 'trees', comp.frames.middle)
            .setTint(comp.colours[1])
            .setOrigin(0,0)
            .setScale(this.scale)
            .setDepth(-1 * index) );
        this.currentImages.push( this._scene.add.image(comp.pos.x, comp.pos.y, 'trees', comp.frames.top)
            .setTint(comp.colours[2])
            .setOrigin(0,0)
            .setScale(this.scale)
            .setDepth(-1 * index) );

    }

    renderBranchComponent(comp: TreeComponent<BranchFrames>, index: number){
        this.currentImages.push( this._scene.add.image(comp.pos.x, comp.pos.y, 'trees', comp.frames.shadow)
            .setTint(comp.colours[0])
            .setOrigin(0,0)
            .setScale(this.scale)
            .setDepth(-1 * index) );
        this.currentImages.push( this._scene.add.image(comp.pos.x, comp.pos.y, 'trees', comp.frames.main)
            .setTint(comp.colours[1])
            .setOrigin(0,0)
            .setScale(this.scale)
            .setDepth(-1 * index) );
    }


}