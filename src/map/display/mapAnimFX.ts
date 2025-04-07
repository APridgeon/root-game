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

    updateTime: number;
    timedEvent: Phaser.Time.TimerEvent;

    constructor(pos: Position, anim: AnimatedTile, scene: Phaser.Scene, animList: MapAnimFX[], updateTime: number, once = true){
        
        this.animTiles = AnimatedTiles.animatedTileSets.get(anim);
        this.pos = pos;
        this.animList = animList;
        this.updateTime = updateTime;
        this.once = once;


        this.image = scene.add.image( Game_Config.MAP_tilesToWorld(pos.x), Game_Config.MAP_tilesToWorld(pos.y), 'plantTilesSpriteSheet', this.animTiles[this.activeTileNo])
            .setOrigin(0)
            .setScale(Game_Config.MAP_SCALE)
            .setDepth(5);

        this.timedEvent = scene.time.addEvent({
            delay: updateTime,
            loop: true,
            callback: () => {
                this.activeTileNo += 1;
                if(this.activeTileNo > this.animTiles.length -1){
                    if(this.once){
                        this.destroy();
                        return
                    } else {
                        this.activeTileNo = 0;
                    }
                }
                this.image.setFrame(this.animTiles[this.activeTileNo]);
            }
        })

    }

    private destroy(): void {
        this.animList.forEach((anim, i) => {
            if(anim == this){
                this.timedEvent.destroy();
                this.animList.splice(i, 1);
                this.image.setVisible(false);
                this.image.destroy();
            }
        })
    }

}