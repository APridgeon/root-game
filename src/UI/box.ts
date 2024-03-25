import * as Phaser from "phaser";
import Game_Config from "../game_config";
import { Position } from "../plant/plantData";
import { BoxTiles } from "./UI_TileSets";

export default class Box {

    _scene: Phaser.Scene;

    rawPos: Position;

    layerName = Math.random().toString();
    tilemap: Phaser.Tilemaps.Tilemap;
    boxLayer: Phaser.Tilemaps.TilemapLayer;
    boxStyle: Map<BoxTiles, integer>;
    pos: Position;
    width: number;
    height: number

    constructor(scene: Phaser.Scene, tilemap: Phaser.Tilemaps.Tilemap, boxStyle: Map<BoxTiles, integer>, x: number, y: number, width: number, height: number){
        this._scene = scene;
        this.rawPos= {x: x, y: y};
        this.setCorrectPosition(x, y, this._scene.game.scale.width, this._scene.game.scale.height);

        this.tilemap = tilemap;
        this.boxLayer = this.tilemap.createBlankLayer(this.layerName,'UI_tiles', this.pos.x, this.pos.y);
        this.boxStyle = boxStyle;
        this.width = width;
        this.height = height;

        let boxData = [[this.boxStyle.get(BoxTiles.topLeft), Array(width - 2).fill(this.boxStyle.get(BoxTiles.top)), this.boxStyle.get(BoxTiles.topRight)].flat(1)];
        Array(height - 2).fill([this.boxStyle.get(BoxTiles.left),  Array(width - 2).fill(this.boxStyle.get(BoxTiles.surrounded)), this.boxStyle.get(BoxTiles.right)].flat(1)).forEach(row => boxData.push(row));
        boxData.push([this.boxStyle.get(BoxTiles.bottomLeft),  Array(width - 2).fill(this.boxStyle.get(BoxTiles.bottom)), this.boxStyle.get(BoxTiles.bottomRight)].flat(1));


        this.boxLayer
            .putTilesAt(boxData, 0, 0)
            .setScale(Game_Config.UI_SCALE);


    }


    setCorrectPosition(x, y, screenWidth: number, screenHeight: number): void {
        let correctX;
        let correctY;

        if(x < 0){
            correctX = screenWidth + x;
        } else {
            correctX = x;
        }
        if(y < 0){
            correctY = screenHeight + y;
        } else {
            correctY = y;
        }

        this.pos = {x: correctX, y: correctY};
    }

    public SetBoxSize(width: number, height: number){
        let boxData = [[this.boxStyle.get(BoxTiles.topLeft), Array(width - 2).fill(this.boxStyle.get(BoxTiles.top)), this.boxStyle.get(BoxTiles.topRight)].flat(1)];
        Array(height - 2).fill([this.boxStyle.get(BoxTiles.left),  Array(width - 2).fill(this.boxStyle.get(BoxTiles.surrounded)), this.boxStyle.get(BoxTiles.right)].flat(1)).forEach(row => boxData.push(row));
        boxData.push([this.boxStyle.get(BoxTiles.bottomLeft),  Array(width - 2).fill(this.boxStyle.get(BoxTiles.bottom)), this.boxStyle.get(BoxTiles.bottomRight)].flat(1));

        this.boxLayer.destroy();
        this.boxLayer = this.tilemap.createBlankLayer(this.layerName,'UI_tiles', this.pos.x, this.pos.y);

        this.boxLayer
            .putTilesAt(boxData, 0, 0)
            .setScale(Game_Config.UI_SCALE);
    }

    public setPosition(pos: Position, width: number, height: number){
        this.rawPos= {x: pos.x, y: pos.y};
        this.setCorrectPosition(pos.x, pos.y, width, height);
        this.boxLayer.setPosition(this.pos.x, this.pos.y);
    }


}
