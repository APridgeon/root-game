import Game_Config from "../game_config";
import { Position } from "../plant/plantData";
import UI_TileSets, { BarometerTiles } from "./UI_TileSets";


export default class Barometer {

    layerName = Math.random().toString();
    tilemap: Phaser.Tilemaps.Tilemap;
    barometerLayer: Phaser.Tilemaps.TilemapLayer;
    waterSprite: Phaser.GameObjects.Image[];
    barometerStyle: Map<BarometerTiles, integer>;
    pos: Position;
    width: integer;

    constructor(scene: Phaser.Scene, tilemap: Phaser.Tilemaps.Tilemap, x: number, y: number, width: integer){
        this.pos = {x: x, y: y};
        this.width = width
        this.tilemap = tilemap;
        this.barometerLayer = this.tilemap.createBlankLayer(this.layerName,'UI_tiles', this.pos.x, this.pos.y);
        this.barometerStyle = UI_TileSets.barometerStyle1;

        let barometerData = [
            [this.barometerStyle.get(BarometerTiles.topLeft), Array(this.width-2).fill([this.barometerStyle.get(BarometerTiles.topMiddle)]), this.barometerStyle.get(BarometerTiles.topRight)].flat(1),
            [this.barometerStyle.get(BarometerTiles.bottomLeft), Array(this.width-2).fill(this.barometerStyle.get(BarometerTiles.bottomMiddle)), this.barometerStyle.get(BarometerTiles.bottomRight)].flat(1)

        ];

        this.waterSprite = [
            scene.add.image(x, y + Game_Config.UI_tilesToWorld(0), 'UI_tiles', this.barometerStyle.get(BarometerTiles.topWater))
                .setScale((this.width)*Game_Config.UI_SCALE, Game_Config.UI_SCALE)
                .setDepth(-1)
                .setOrigin(0)
            ,
            scene.add.image(x, y + Game_Config.UI_tilesToWorld(1), 'UI_tiles', this.barometerStyle.get(BarometerTiles.bottomWater))
                .setScale((this.width)*Game_Config.UI_SCALE, Game_Config.UI_SCALE)
                .setDepth(-1)
                .setOrigin(0)
        ];

        this.barometerLayer
            .setScale(Game_Config.MAP_SCALE)
            .putTilesAt(barometerData, 0 ,0);

        this.setWaterBar(Game_Config.PLANT_DATA_WATER_START_LEVEL);
    }

    public setWaterBar(water: integer){
        let scaleAmount = (water/200);
        scaleAmount = (scaleAmount > 1) ? 1 : scaleAmount;
        scaleAmount = (scaleAmount < 0) ? 0 : scaleAmount;
        this.waterSprite.forEach(image => {
            image.setScale(this.width*Game_Config.UI_SCALE*scaleAmount, Game_Config.UI_SCALE)
        })
    }

    public setPosition(pos: Position){
        this.barometerLayer.setPosition(pos.x, pos.y);
        this.waterSprite[0].setPosition(pos.x, pos.y);
        this.waterSprite[1].setPosition(pos.x, pos.y + Game_Config.UI_tilesToWorld(1));
    }


}