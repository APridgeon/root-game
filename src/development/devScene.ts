import * as Phaser from 'phaser';
import ProceduralTree from './proceduralTree';
import GraphicsTree from './graphicsTree';

export default class DevScene extends Phaser.Scene {

    constructor(){
        super({key: 'DevScene'});
    }

    preload(){
        this.load.spritesheet('trees','assets/plants/proceduralTrees.png', {frameWidth: 16, frameHeight: 16});
    }

    create(){

        new GraphicsTree(this);
        // new ProceduralTree(this);

    }

}