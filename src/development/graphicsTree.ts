
export default class GraphicsTree {

    _scene: Phaser.Scene;

    gOb: Phaser.GameObjects.Graphics;

    //settings
    loss= 0.03 // Width loss per cycle
    minSleep= 10 // Min sleep time (For the animation)
    branchLoss= 0.8 // % width maintained for branches
    mainLoss= 0.8 // % width maintained after branching
    speed= 0.3 // Movement speed
    newBranch= 0.8 // Chance of not starting a new branch 
    colorful= false // Use colors for new trees
    fastMode= true // Fast growth mode
    fadeOut= true // Fade slowly to black
    fadeAmount= 0.05 // How much per iteration
    autoSpawn= true // Automatically create trees
    spawnInterval= 250 // Spawn interval in ms
    fadeInterval= 250 // Fade interval in ms
    initialWidth= 10 // Initial branch width
    indicateNewBranch= false // Display a visual indicator when a new branch is born
    fitScreen= false // Resize canvas to fit screen
    treeColor= '#ff0000'
    bgColor= [0, 0, 0]

    constructor(scene: Phaser.Scene){
        this._scene = scene;


        let pixel = (this._scene.renderer as Phaser.Renderer.WebGL.WebGLRenderer).pipelines.getPostPipeline('PixelatedFX');
        console.log(pixel);

        this.gOb = scene.add.graphics();

        this.branch(200, 300, 0, -3, 10, 30, 0, this.treeColor);

        this.gOb.setPostPipeline(pixel)


    }


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


}