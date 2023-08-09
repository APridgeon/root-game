import * as Phaser from "phaser";
import Game_Config from "../game_config";
import { Position } from "../plant/plantData";
import { BoxTiles } from "./UI_TileSets";

export default class Box {

    layerName = Math.random().toString();
    tilemap: Phaser.Tilemaps.Tilemap;
    boxLayer: Phaser.Tilemaps.TilemapLayer;
    boxStyle: Map<BoxTiles, integer>;
    pos: Position;

    constructor(tilemap: Phaser.Tilemaps.Tilemap, boxStyle: Map<BoxTiles, integer>, x: number, y: number, width: number, height: number){
        this.pos = {x: x, y: y};
        this.tilemap = tilemap;
        this.boxLayer = this.tilemap.createBlankLayer(this.layerName,'UI_tiles', this.pos.x, this.pos.y);
        this.boxStyle = boxStyle;

        let boxData = [[this.boxStyle.get(BoxTiles.topLeft), Array(width - 2).fill(this.boxStyle.get(BoxTiles.top)), this.boxStyle.get(BoxTiles.topRight)].flat(1)];
        Array(height - 2).fill([this.boxStyle.get(BoxTiles.left),  Array(width - 2).fill(this.boxStyle.get(BoxTiles.surrounded)), this.boxStyle.get(BoxTiles.right)].flat(1)).forEach(row => boxData.push(row));
        boxData.push([this.boxStyle.get(BoxTiles.bottomLeft),  Array(width - 2).fill(this.boxStyle.get(BoxTiles.bottom)), this.boxStyle.get(BoxTiles.bottomRight)].flat(1));


        this.boxLayer
            .putTilesAt(boxData, 0, 0)
            .setScale(Game_Config.UI_SCALE);


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

}
