import { Events } from "../events/events";
import Game_Config from "../game_config";
import TreeComponents from "./aerialTreeTiles";
import { Position } from "./plantData";
import * as Phaser from 'phaser';

export class Tree {

    private _graphicsOb: Phaser.GameObjects.Graphics;
    private _scene: Phaser.Scene;

    leafClumps: Phaser.GameObjects.Image[] = [];

    private pos: Position;
    private scale = Game_Config.MAP_SCALE;
    public treeSettings: TreeSettings;

    private buds: GrowthBud[] = [];


    constructor(pos: Position, treeSettings: TreeSettings, graphicsOb: Phaser.GameObjects.Graphics, scene: Phaser.Scene){

        this._graphicsOb = graphicsOb;
        this._scene = scene;

        this.pos = pos;
        this.treeSettings = treeSettings;

        this.buds.push(new GrowthBud(this.pos, 0, 0, 1));


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
            if(this.treeSettings.life > this.treeSettings.branchDelay && bud.life % this.treeSettings.internodeLength === 0 && i < this.treeSettings.abilityToBranch && this.treeSettings.life < this.treeSettings.branchTermination){

                let newAngle = Phaser.Math.RND.between(0, 90) * Phaser.Math.RND.sign();
                let newGrowthLength = 1 * bud.growthLength;
                this.buds.push(new GrowthBud(bud.pos, newAngle, bud.life + this.treeSettings.newBranchesTerminateSooner, newGrowthLength));
                // this.drawLeafClump(bud);
            }

            //draw leaf clump at end of branch (except initial branch)
            if(bud.life > this.treeSettings.branchTermination && i !== 0){
                this.drawLeafClump(bud);
                // this.buds.splice(i, 1);
            }



            if(i === 0){
                this.treeSettings.life += 1;
                this.treeSettings.lineWidth *= this.treeSettings.lineWidthDecrease;
                if(this.treeSettings.lineWidth < 1) this.treeSettings.lineWidth = 1;
            }


        })

    }

    private drawLeafClump(bud: GrowthBud){
        let choice = Phaser.Math.RND.between(0, TreeComponents.LeafComponents.length-1);

        this.leafClumps.push( this._scene.add.image(Math.round(bud.pos.x/this.scale) * this.scale, Math.round(bud.pos.y/this.scale) * this.scale, 'trees', TreeComponents.LeafComponents[choice].bottom)
            .setScale(this.scale)
            .setTint(0x413452) )
        
        this.leafClumps.push( this._scene.add.image(Math.round(bud.pos.x/this.scale) * this.scale, Math.round(bud.pos.y/this.scale) * this.scale, 'trees', TreeComponents.LeafComponents[choice].middle)
            .setScale(this.scale)
            .setTint(0x3b6e7f) )
        
        this.leafClumps.push( this._scene.add.image(Math.round(bud.pos.x/this.scale) * this.scale, Math.round(bud.pos.y/this.scale) * this.scale,  'trees', TreeComponents.LeafComponents[choice].top)
            .setScale(this.scale)
            .setTint(0x66ab8c) )
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

    constructor(pos: Position, angle: number, life: number, growthLength: number){
        this.pos = pos;
        this.angle = angle;
        this.life = life;
        this.growthLength = growthLength;
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
    branchTermination: number
}