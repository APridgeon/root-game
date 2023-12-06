import { Position } from "../plant/plantData";
import PixelatedFX from "./pixelatedFX";
import * as Phaser from 'phaser';
import TreeComponents from "./treeTiles";
import Game_Config from "../game_config";

export default class GraphicsTree {

    _scene: Phaser.Scene;

    gOb: Phaser.GameObjects.Graphics;

    scale = 4;

    growthBuds: {
        pos: Position, 
        angle: number,
        life: number
    }[]  = [
        {
            pos: {x: 100, y: 150}, 
            angle: 70,
            life: 0
        }
    ];

    life = 0;

    constructor(scene: Phaser.Scene){
        this._scene = scene;


        let pixel = (this._scene.renderer as Phaser.Renderer.WebGL.WebGLRenderer).pipelines.getPostPipeline('PixelatedFX') as PixelatedFX;


        this.gOb = scene.add.graphics();
        this.growTree();

        this.gOb.setPostPipeline(pixel);
        let post = this.gOb.postPipelines[0] as PixelatedFX;
        post.setup(this.scale - 2, {NE: 0.1, SE: 0.1, SW: 0, NW: 0});


    }

    growTree(){

        // this._scene.input.on(Phaser.Input.Events.POINTER_DOWN, () => {
        //     this.step();
        // })

        this._scene.time.addEvent({
            loop: true,
            delay: 1,
            callback: () => this.step()
        })


    }


    lineWidth = this.scale * 6;
    lineWidthDecrease = 0.98;
    
    growthAmount = 1.2;
    wobbliness = 60;
    internodeLength = 3

    branchDelay = 60;
    abilityToBranch = 1;
    newBranchesTerminateSooner = 0;
    branchTermination = 100;

    step(){
        this.growthBuds.forEach((bud, i) => {

            let choice = Phaser.Math.Between(0,1);
            let branchColours = [0x816976, 0x4a3838];

            this.gOb.setDefaultStyles({lineStyle: {width: this.lineWidth, color: branchColours[choice]}, fillStyle: {color: branchColours[choice]}});


            this.gOb.beginPath();
            this.gOb.moveTo(bud.pos.x * this.scale, bud.pos.y * this.scale);

            let angle = Phaser.Math.Between(90 - (1* this.wobbliness), 90 + (1 * this.wobbliness));
            if(i !== 0 ){
                angle += bud.angle;
            }

            let newX = Math.cos((Math.PI/180) * angle) * this.growthAmount
            let newY = Math.sin((Math.PI/180) * angle) * this.growthAmount;


            this.gOb.lineTo((bud.pos.x - newX) * this.scale, (bud.pos.y - newY) * this.scale);
            this.gOb.stroke();
            this.gOb.fillCircle((bud.pos.x - newX) * this.scale, (bud.pos.y - newY) * this.scale, this.lineWidth * 0.5);
    
            this.growthBuds[i] = {pos: {x: (bud.pos.x - newX), y: (bud.pos.y - newY)}, angle: bud.angle, life: bud.life + 1};

            if(this.life > this.branchDelay && this.life % this.internodeLength === 0 && i < this.abilityToBranch){
                let newAngle = Phaser.Math.Between(0, 90) * Phaser.Math.RND.sign();
                this.growthBuds.push({pos: {x: (bud.pos.x), y: (bud.pos.y)}, angle: newAngle, life: bud.life + this.newBranchesTerminateSooner});
                // this.drawLeafClump(bud);

            }

            if(bud.life > this.branchTermination){
                this.growthBuds.splice(i, 1);
                this.drawLeafClump(bud);
  
            }

            if(i === 0){
                this.life += 1;
                this.lineWidth *= this.lineWidthDecrease;
            }


        })

    }

    drawLeafClump(bud){
        let choice = Phaser.Math.Between(0, TreeComponents.LeafComponents.length-1);

        this._scene.add.image(Math.round(bud.pos.x) * this.scale, Math.round(bud.pos.y) * this.scale, 'trees', TreeComponents.LeafComponents[choice].bottom)
            .setScale(this.scale)
            .setTint(0x413452)
        
        this._scene.add.image(Math.round(bud.pos.x) * this.scale, Math.round(bud.pos.y) * this.scale, 'trees', TreeComponents.LeafComponents[choice].middle)
            .setScale(this.scale)
            .setTint(0x3b6e7f)
        
        this._scene.add.image(Math.round(bud.pos.x) * this.scale, Math.round(bud.pos.y) * this.scale, 'trees', TreeComponents.LeafComponents[choice].top)
            .setScale(this.scale)
            .setTint(0x66ab8c)
    }


}