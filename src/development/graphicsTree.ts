import { Position } from "../plant/plantData";
import PixelatedFX from "./pixelatedFX";
import * as Phaser from 'phaser';
import TreeComponents from "./treeTiles";
import Game_Config from "../game_config";

export default class GraphicsTree {

    _scene: Phaser.Scene;

    gOb: Phaser.GameObjects.Graphics;
    leafClumps: Phaser.GameObjects.Image[] = [];

    scale = 4;

    growthLengthInput: HTMLInputElement;
    wobbleInput: HTMLInputElement;
    branchWidthInput: HTMLInputElement;


    constructor(scene: Phaser.Scene){

        let gameDiv = document.getElementById("controls")

        let wobbleTitle = document.createElement("b");
        wobbleTitle.innerText = "wobble";
        this.wobbleInput = document.createElement("input");
        this.wobbleInput.type = "range";
        this.wobbleInput.min = "0";
        this.wobbleInput.max = "180";
        this.wobbleInput.value = "90";

        gameDiv.appendChild(wobbleTitle);
        gameDiv.appendChild(this.wobbleInput);


        let growthLengthTitle = document.createElement("b");
       growthLengthTitle.innerText = "growth length";
        this.growthLengthInput = document.createElement("input");
        this.growthLengthInput.type = "range";
        this.growthLengthInput.min = "0.00";
        this.growthLengthInput.max = "3.00";
        this.growthLengthInput.value = "1.00";
        this.growthLengthInput.step = "0.01";

        gameDiv.appendChild(growthLengthTitle);
        gameDiv.appendChild(this.growthLengthInput);

        let branchWidthTitle = document.createElement("b");
        branchWidthTitle.innerText = "branchWidth";
        this.branchWidthInput = document.createElement("input");
        this.branchWidthInput.type = "range";
        this.branchWidthInput.min = "3.00";
        this.branchWidthInput.max = "20.00";
        this.branchWidthInput.value = "4.00";
        this.branchWidthInput.step = "0.01";

        gameDiv.appendChild(branchWidthTitle);
        gameDiv.appendChild(this.branchWidthInput);



        this._scene = scene;
        let pixel = (this._scene.renderer as Phaser.Renderer.WebGL.WebGLRenderer).pipelines.getPostPipeline('PixelatedFX') as PixelatedFX;


        this.gOb = scene.add.graphics();

        this._scene.input.on(Phaser.Input.Events.POINTER_DOWN, () => {
            this.gOb.clear();
            this.leafClumps.forEach(leafClump => leafClump.destroy())
            this.growTree({x: 100, y: 150});
        })

        

        this.gOb.setPostPipeline(pixel);
        let post = this.gOb.postPipelines[0] as PixelatedFX;
        post.setup(this.scale - 2, {NE: 0.1, SE: 0.1, SW: 0, NW: 0});


    }

    growTree(pos: Position){

        let growthBud = [
            {
                pos: {x: pos.x, y: pos.y}, 
                angle: 70,
                life: 0
            }
        ];

        let treeSettings = {
            life: 0,

            lineWidth: this.branchWidthInput.value,
            lineWidthDecrease: 0.98,
            
            growthAmount: this.growthLengthInput.value,
            wobbliness: this.wobbleInput.value,
            internodeLength: 3,
        
            branchDelay: 60,
            abilityToBranch: 1,
            newBranchesTerminateSooner: 0,
            branchTermination: 100,
        }

        this._scene.time.addEvent({
            loop: true,
            delay: 0.1,
            callback: () => this.step(growthBud, treeSettings)
        })


    }




    step(growthBud, treeSettings){
        growthBud.forEach((bud, i) => {

            let choice = Phaser.Math.Between(0,1);
            let branchColours = [0x816976, 0x4a3838];

            this.gOb.setDefaultStyles({lineStyle: {width: (treeSettings.lineWidth * this.scale), color: branchColours[choice]}, fillStyle: {color: branchColours[choice]}});


            this.gOb.beginPath();
            this.gOb.moveTo(bud.pos.x * this.scale, bud.pos.y * this.scale);

            let angle = Phaser.Math.Between(90 - (1* treeSettings.wobbliness), 90 + (1 * treeSettings.wobbliness));
            if(i !== 0 ){
                angle += bud.angle;
            }

            let newX = Math.cos((Math.PI/180) * angle) * treeSettings.growthAmount
            let newY = Math.sin((Math.PI/180) * angle) * treeSettings.growthAmount;


            this.gOb.lineTo((bud.pos.x - newX) * this.scale, (bud.pos.y - newY) * this.scale);
            this.gOb.stroke();
            this.gOb.fillCircle((bud.pos.x - newX) * this.scale, (bud.pos.y - newY) * this.scale, treeSettings.lineWidth * 0.5 * this.scale);
    
            growthBud[i] = {pos: {x: (bud.pos.x - newX), y: (bud.pos.y - newY)}, angle: bud.angle, life: bud.life + 1};

            if(treeSettings.life > treeSettings.branchDelay && treeSettings.life % treeSettings.internodeLength === 0 && i < treeSettings.abilityToBranch){
                let newAngle = Phaser.Math.Between(0, 90) * Phaser.Math.RND.sign();
                growthBud.push({pos: {x: (bud.pos.x), y: (bud.pos.y)}, angle: newAngle, life: bud.life + treeSettings.newBranchesTerminateSooner});
                // this.drawLeafClump(bud);

            }

            if(bud.life > treeSettings.branchTermination){
                growthBud.splice(i, 1);
                this.drawLeafClump(bud);
  
            }

            if(i === 0){
                treeSettings.life += 1;
                treeSettings.lineWidth *= treeSettings.lineWidthDecrease;
            }


        })

    }

    drawLeafClump(bud){
        let choice = Phaser.Math.Between(0, TreeComponents.LeafComponents.length-1);


        this.leafClumps.push( this._scene.add.image(Math.round(bud.pos.x) * this.scale, Math.round(bud.pos.y) * this.scale, 'trees', TreeComponents.LeafComponents[choice].bottom)
            .setScale(this.scale)
            .setTint(0x413452) )
        
        this.leafClumps.push( this._scene.add.image(Math.round(bud.pos.x) * this.scale, Math.round(bud.pos.y) * this.scale, 'trees', TreeComponents.LeafComponents[choice].middle)
            .setScale(this.scale)
            .setTint(0x3b6e7f) )
        
        this.leafClumps.push( this._scene.add.image(Math.round(bud.pos.x) * this.scale, Math.round(bud.pos.y) * this.scale, 'trees', TreeComponents.LeafComponents[choice].top)
            .setScale(this.scale)
            .setTint(0x66ab8c) )
    }


}