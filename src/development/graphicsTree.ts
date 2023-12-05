import { Position } from "../plant/plantData";
import PixelatedFX from "./pixelatedFX";
import * as Phaser from 'phaser';

export default class GraphicsTree {

    _scene: Phaser.Scene;

    gOb: Phaser.GameObjects.Graphics;

    //settings
    loss= 0.07 // Width loss per cycle
    minSleep= 10 // Min sleep time (For the animation)
    branchLoss= 0.9 // % width maintained for branches
    mainLoss= 0.9 // % width maintained after branching
    speed= 0.3 // Movement speed
    newBranch= 0.8 // Chance of not starting a new branch 
    colorful= false // Use colors for new trees
    fastMode= true // Fast growth mode
    fadeOut= true // Fade slowly to black
    fadeAmount= 0.05 // How much per iteration
    autoSpawn= true // Automatically create trees
    spawnInterval= 50 // Spawn interval in ms
    fadeInterval= 250 // Fade interval in ms
    initialWidth= 10 // Initial branch width
    indicateNewBranch= false // Display a visual indicator when a new branch is born
    fitScreen= false // Resize canvas to fit screen
    treeColor= 0xff0000
    bgColor= [0, 0, 0]




    branch(x, y, dx, dy, w, growthRate, lifetime, branchColor) {

        let lineWidth = w - lifetime * this.loss;
        this.gOb.setDefaultStyles({lineStyle: {width: lineWidth, color: branchColor}, fillStyle: branchColor});

        this.gOb.beginPath();
        this.gOb.moveTo(x, y);

        if(this.fastMode) growthRate *= 0.5;

        x = x + dx;
        y = y + dy;

        dx = dx + Math.sin(Math.random() + lifetime) * this.speed;
        dy = dy + Math.sin(Math.random() + lifetime) * this.speed;

        this.gOb.lineTo(x, y);
        this.gOb.stroke();

        if(lifetime > 5 * w + Math.random() * 100 && Math.random() > this.newBranch)[

            setTimeout( () => {
                this.branch(x, y, 2 * Math.sin(Math.random() + lifetime), 2 * Math.cos(Math.random() + lifetime), (w - lifetime * this.loss) * this.branchLoss, growthRate + Math.random() * 100, 0, branchColor);
                w *= this.mainLoss;
            }, 2 * growthRate, Math.random() + this.minSleep)
        ]

        if(w - lifetime * this.loss >= 1){
            setTimeout( () => {
                this.branch(x, y, dx, dy, w, growthRate, ++lifetime, branchColor);
            }, growthRate)
        }
    }



    scale = 4;
    
    growthAmount = 1;
    growthBuds: {pos: Position, angle: number}[] = [{pos: {x: 150, y: 150}, angle: 0}];

    life = 0;

    constructor(scene: Phaser.Scene){
        this._scene = scene;


        let pixel = (this._scene.renderer as Phaser.Renderer.WebGL.WebGLRenderer).pipelines.getPostPipeline('PixelatedFX') as PixelatedFX;


        this._scene.add.circle(200, 200, 80, 0x00ff00);

        this.gOb = scene.add.graphics();
        this.growTree();
        // this.branch(200, 400, 0, -3, 10, 30, 0, this.treeColor);

        this.gOb.setPostPipeline(pixel);
        let post = this.gOb.postPipelines[0] as PixelatedFX;
        post.setup(this.scale - 2, {NE: 0.2, SE: 0, SW: 0, NW: 0.2});


    }

    growTree(){
        this.gOb.setDefaultStyles({lineStyle: {width: this.scale, color: 0x413452}});

        this._scene.input.on(Phaser.Input.Events.POINTER_DOWN, () => {
            this.step();
        })

        this._scene.time.addEvent({
            loop: true,
            delay: 50,
            callback: () => this.step()
        })


    }

    step(){
        this.growthBuds.forEach((bud, i) => {
            this.gOb.beginPath();
            this.gOb.moveTo(bud.pos.x * this.scale, bud.pos.y * this.scale);

            let angle = Phaser.Math.Between(45, 135);
            if(i !== 0 ){
                angle += bud.angle;
            }

            let newX = Math.cos((Math.PI/180) * angle) * 1;
            let newY = Math.sin((Math.PI/180) * angle) * 1;


            this.gOb.lineTo((bud.pos.x - newX) * this.scale, (bud.pos.y - newY) * this.scale);
            this.gOb.stroke();
    
            this.growthBuds[i] = {pos: {x: (bud.pos.x - newX), y: (bud.pos.y - newY)}, angle: bud.angle};

            if(this.life > 0 && this.life % 6 === 0 && i < 3){
                let newAngle = Phaser.Math.Between(0, 90) * Phaser.Math.RND.sign();
                this.growthBuds.push({pos: {x: (bud.pos.x), y: (bud.pos.y)}, angle: newAngle});
            }

            if(i === 0){
                this.life += 1;
            }

        })

    }


}