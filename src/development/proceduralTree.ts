import TreeComponents from "./treeTiles";


export default class ProceduralTree {

    _scene: Phaser.Scene;


    constructor(scene: Phaser.Scene){

        this._scene = scene;
        this.addTree();


    }

    addTree(){
        this._scene.add.image(10, 10, 'trees', TreeComponents.LeafComponents[0].bottom)
            .setTint(0xff0000);
        this._scene.add.image(10, 10, 'trees', TreeComponents.LeafComponents[0].middle).setTint(0xff0000);
        this._scene.add.image(10, 10, 'trees', TreeComponents.LeafComponents[0].top).setTint(0xff0000);
    }

}