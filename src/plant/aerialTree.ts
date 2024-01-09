import { Events } from "../events/events";
import Game_Config from "../game_config";
import TreeComponents, { TreeType } from "./aerialTreeTiles";
import { Position } from "./plantData";
import * as Phaser from 'phaser';

export class Tree {

    private _graphicsOb: Phaser.GameObjects.Graphics;
    private _scene: Phaser.Scene;

    leafClumps: Phaser.GameObjects.Image[] = [];

    private pos: Position;
    private scale = Game_Config.MAP_SCALE;
    public treeSettings: TreeSettings;

    buds: GrowthBud[] = [];


    constructor(pos: Position, treeSettings: TreeSettings, graphicsOb: Phaser.GameObjects.Graphics, scene: Phaser.Scene){

        this._graphicsOb = graphicsOb;
        this._scene = scene;

        this.pos = pos;
        this.treeSettings = treeSettings;

        this.buds.push(new GrowthBud(this.pos, 0, 0, 1, this.treeSettings.treeType));


        Phaser.Math.RND.sow([`${this.treeSettings.seed}`]);
        for(let i = 0; i < 5; i ++){
            this.generateTree();
        }

        this._scene.scene.get('UI').events.on(Events.TurnConfirm, () => {
            this.generateTree();
        })

    }

    private generateTree() {
        this.leafClumps.forEach(clump => {clump.destroy()})
        this.buds.forEach((bud, i) => {

            if(bud.growing){
                let choice = Phaser.Math.RND.between(0,1);
                let branchColours = [0x816976, 0x4a3838];
    
                this._graphicsOb.setDefaultStyles({lineStyle: {width: (this.treeSettings.lineWidth * this.scale), color: branchColours[choice]}, fillStyle: {color: branchColours[choice]}});
    
                this._graphicsOb.beginPath();
                this._graphicsOb.moveTo(bud.pos.x, bud.pos.y);
    
                //Choosing angle
                let angle = Phaser.Math.RND.between(90 - (1* this.treeSettings.wobbliness), 90 + (1 * this.treeSettings.wobbliness));
                angle += bud.angle;
    
                //stop branches growing below the screen
                if(bud.pos.y > (this.pos.y) - (10 * this.scale)){
                    if(angle < 0){
                        bud.angle += 90
                    }else if(angle > 180){
                        bud.angle -=90
                    }
                }
    
                //generate new growth
                let dx = (Math.cos((Math.PI/180) * angle) * (this.treeSettings.growthAmount * bud.growthLength)) * this.scale;
                let dy = (Math.sin((Math.PI/180) * angle) * (this.treeSettings.growthAmount * bud.growthLength)) * this.scale;
    
                bud.pos = {x: (bud.pos.x - dx), y: (bud.pos.y - dy)};
    
                this._graphicsOb.lineTo(bud.pos.x, bud.pos.y);
                this._graphicsOb.stroke();
                this._graphicsOb.fillCircle(bud.pos.x, bud.pos.y, this.treeSettings.lineWidth * 0.5 * this.scale);
        
                bud.life += 1;
    
                //decide whether branching should happen
                if(this.treeSettings.life > this.treeSettings.branchDelay && bud.life % this.treeSettings.internodeLength === 0 && i < this.treeSettings.abilityToBranch){
    
                    let newAngle = Phaser.Math.RND.between(0, 90) * Phaser.Math.RND.sign();
                    let newGrowthLength = 1 * bud.growthLength;
                    this.buds.push(new GrowthBud(bud.pos, newAngle, 0, newGrowthLength, this.treeSettings.treeType));
                    // this.drawLeafClump(bud);
                }
            }

 
            //draw leaf clump at end of branch (except initial branch)
            if(bud.life > this.treeSettings.startLeafGrowth && i !== 0){
                this.drawLeafClump(bud, this.treeSettings.color);
                // this.buds.splice(i, 1);
            }


            //draw leaf clump at end of branch (except initial branch)
            if(bud.life > this.treeSettings.newBranchesTerminateSooner && i !== 0){
                this.drawLeafClump(bud, this.treeSettings.color);
                bud.growing = false;
            }


            if(i === 0){
                this.treeSettings.life += 1;
                this.treeSettings.lineWidth *= this.treeSettings.lineWidthDecrease;
                if(this.treeSettings.lineWidth < 1) this.treeSettings.lineWidth = 1;
            }


        })

    }

    private drawLeafClump(bud: GrowthBud, colour: Phaser.Display.Color){

        let hue = colour.h;
        let h1 = colour.h - 0.2;
        if(h1 < 0){
            h1 = 1 - h1;
        }
        let h2 = colour.h - 0.4;
        if(h2 < 0){
            h2 = 1 - h2;
        }

        let c1 = colour.clone().setFromHSV(colour.h, 0.37, 0.32);
        let c2 = colour.clone().setFromHSV(h1, 0.54, 0.50);
        let c3 = colour.clone().setFromHSV(h2, 0.4, 0.6);

        let leafFrame = TreeComponents.treeTypeLeafMap.get(this.treeSettings.treeType)[bud.leafChoice];

        this.leafClumps.push( this._scene.add.image(Math.round(bud.pos.x/this.scale) * this.scale, Math.round(bud.pos.y/this.scale) * this.scale, 'trees', leafFrame.bottom)
            .setScale(this.scale)
            .setTint(c1.color)
            // .setTint(0x413452)
            .setDepth(5) )
        
        this.leafClumps.push( this._scene.add.image(Math.round(bud.pos.x/this.scale) * this.scale, Math.round(bud.pos.y/this.scale) * this.scale, 'trees', leafFrame.middle)
            .setScale(this.scale)
            .setTint(c2.color)
            // .setTint(0x3b6e7f)
            .setDepth(5) )
        
        this.leafClumps.push( this._scene.add.image(Math.round(bud.pos.x/this.scale) * this.scale, Math.round(bud.pos.y/this.scale) * this.scale,  'trees', leafFrame.top)
            .setScale(this.scale)
            .setTint(c3.color)
            // .setTint(0x66ab8c)
            .setDepth(5) )
    }

    public clear(){
        this.leafClumps.forEach(clump => clump.destroy());
        this.buds.splice(0, this.buds.length);
    }

    public growOne(){
        // this._graphicsOb.clear();
        this.leafClumps.forEach(clump => clump.destroy());
        this.generateTree();
    }
}

export class GrowthBud {

    pos: Position;
    angle: number;
    life: number;
    growthLength: number;
    treeType: TreeType;

    growing: boolean = true;

    leafChoice: number;

    constructor(pos: Position, angle: number, life: number, growthLength: number, treeType: TreeType){
        this.pos = pos;
        this.angle = angle;
        this.life = life;
        this.growthLength = growthLength;
        this.treeType = treeType;

        this.leafChoice = Phaser.Math.RND.between(0, TreeComponents.treeTypeLeafMap.get(this.treeType).length - 1);
    }

}

export type TreeSettings = {
    seed: string,
    life: number,
    lineWidth: number,
    lineWidthDecrease: number,
    growthAmount: number,
    wobbliness: number,
    internodeLength: number,
    branchDelay: number,
    abilityToBranch: number,
    newBranchesTerminateSooner: number,
    startLeafGrowth: number,
    color: Phaser.Display.Color,
    treeType: TreeType
}