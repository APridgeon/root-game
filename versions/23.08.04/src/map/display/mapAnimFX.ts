import Game_Config from "../../game_config";
import { Position } from "../../plant/plantData";
import AnimatedTiles, { AnimatedTile } from "./animatedTiles";


export default class MapAnimFX {


    //image gameobject
    image: Phaser.GameObjects.Image;
    //animated tiles
    animTiles: integer[];
    activeTileNo = 0;
    //position
    pos: Position;
    //mapDisplays anim FX array
    animList: MapAnimFX[];


    //anim plays once
    once: boolean;

    nextUpdate: number;
    updateTime: number;

    constructor(pos: Position, anim: AnimatedTile, scene: Phaser.Scene, animList: MapAnimFX[], updateTime: number, once = true){
        
        this.animTiles = AnimatedTiles.animatedTileSets.get(anim);
        this.pos = pos;
        this.animList = animList;
        this.updateTime = updateTime;
        this.nextUpdate = scene.time.now + updateTime;
        this.once = once;


        this.image = scene.add.image( Game_Config.MAP_tilesToWorld(pos.x), Game_Config.MAP_tilesToWorld(pos.y), 'plantTilesSpriteSheet', this.animTiles[this.activeTileNo])
            .setOrigin(0)
            .setScale(Game_Config.MAP_SCALE);

    }

    public GetNextAnimTile(): void {

        let currentIndex = this.activeTileNo;
        if(currentIndex === this.animTiles.length - 1){
            this.activeTileNo = 0;
        }
        else {
            this.activeTileNo += 1;
        }

    }

    update(time: Number): void {
        if(time.valueOf() > this.nextUpdate){

            this.GetNextAnimTile();

            if(this.activeTileNo === 0 && this.once){
                this.animList.forEach((anim, i) => {
                    if(anim == this){
                        this.animList.splice(i, 1);
                    }
                })
                this.image.setVisible(false);
                this.image.destroy();
    
    
            } else {
                this.image.setFrame(this.animTiles[this.activeTileNo]);
            }

            this.nextUpdate += this.updateTime;
        }
    }




}