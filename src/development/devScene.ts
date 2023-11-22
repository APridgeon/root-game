import * as Phaser from 'phaser';

export default class DevScene extends Phaser.Scene {

    constructor(){
        super({key: 'DevScene'});
    }

    preload(){
        this.load.spritesheet('trees','assets/plants/proceduralTrees.png', {frameWidth: 16, frameHeight: 16});
    }

    create(){
        this.add.image(0, 0, 'trees', (6*4) + 1)
            .setOrigin(0,0)
            .setTint(0x413452)
            .setScale(4);

        this.add.image(0, 0, 'trees', (6*4) + 2)
            .setOrigin(0,0)
            .setTint(0x3b6e7f)
            .setScale(4);
        
        this.add.image(0, 0, 'trees', (6*4) + 3)
            .setOrigin(0,0)
            .setTint(0x66ab8c)
            .setScale(4);
    }

}