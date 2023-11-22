import TreeComponents, { LeafComponent } from "./treeTiles";


export default class ProceduralTree {

    _scene: Phaser.Scene;

    leafComponents: LeafComponent[] = [];
    colours: number[] = [0xff0000, 0x00ff00, 0x0000ff];


    constructor(scene: Phaser.Scene){

        this._scene = scene;
        this.addComponent();
        this.renderComponents();


    }

    addComponent(){
        this.leafComponents.push(TreeComponents.LeafComponents[0]);
    }

    renderComponents(){
        this.leafComponents.forEach(comp => {
            this._scene.add.image(20, 20, 'trees', comp.bottom).setTint(this.colours[0]).setScale(10);
            this._scene.add.image(20, 20, 'trees', comp.middle).setTint(this.colours[1]).setScale(10);
            this._scene.add.image(20, 20, 'trees', comp.top).setTint(this.colours[2]).setScale(10);
        })
    }

}