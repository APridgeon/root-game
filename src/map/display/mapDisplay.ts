import * as Phaser from 'phaser';
import Game_Config from '../../game_config';
import MapData from '../data/mapData';
import RuleTileSets, { RuleTile } from './ruleTileSets';
import { AnimatedTile } from './animatedTiles';
import MapAnimFX from './mapAnimFX';
import { Position } from '../../plant/plantData';
import { Events } from '../../events/events';
import SkyManager from './skyManager';
import { LandTypes } from '../data/landGenerator';
import LandData from '../data/landData';


export default class RuleTileMapDisplay
{
    private _scene: Phaser.Scene;
    private _mapData: MapData;
    private _texture: string;

    private landDataTextureIndex: number[][] = [...Array(Game_Config.MAP_SIZE.y)].map(e => Array(Game_Config.MAP_SIZE.x).fill(-1));
    private waterDataTextureIndex: number[][] = [...Array(Game_Config.MAP_SIZE.y)].map(e => Array(Game_Config.MAP_SIZE.x).fill(-1));
    private landBeforeHolesTextureIndex: number[][] =  [...Array(Game_Config.MAP_SIZE.y)].map(e => Array(Game_Config.MAP_SIZE.x).fill(-1));
    
    private _tilemap: Phaser.Tilemaps.Tilemap;
    get tilemap(){
        return this._tilemap
    }

    private tiles: Phaser.Tilemaps.Tileset;
    private soilTiles: Phaser.Tilemaps.Tileset;

    private landTileLayer: Phaser.Tilemaps.TilemapLayer;
    private waterTileLayer: Phaser.Tilemaps.TilemapLayer;


    private _mapAnimFX: MapAnimFX[] = [];
    get mapAnimFX(){
        return this._mapAnimFX;
    }

    private soilBackgroundTileLayer: Phaser.Tilemaps.TilemapLayer;


    constructor(scene: Phaser.Scene, mapData: MapData, texture: string){

        this._scene = scene;
        this._mapData = mapData;
        this._texture = texture;

        this.convertToRuleTileData2(this._mapData._landGenerator.landData);
        this.waterDataTextureIndex = this.convertToRuleTileData(this._mapData.waterData, RuleTileSets.waterTileSet);
        this.landBeforeHolesTextureIndex = this.convertToRuleTileData(this._mapData.landDataBeforeHoles, RuleTileSets.landTileSet);


        this._tilemap = scene.make.tilemap({tileWidth: Game_Config.MAP_RES, tileHeight: Game_Config.MAP_RES, width: Game_Config.MAP_SIZE.x, height: Game_Config.MAP_SIZE.y});
        this.tiles = this._tilemap.addTilesetImage(texture, null, Game_Config.MAP_RES, Game_Config.MAP_RES, 0, 0);

        new SkyManager(this._tilemap, scene);
        this.setUpTileLayers();
        this.setUpBackgrounds();
        this.setUpAnimations();

    }

    private convertToRuleTileData(mapData: boolean[][], ruleTileSet: Map<RuleTile, integer>): number[][] {

        let tileIndexData = [...Array(Game_Config.MAP_SIZE.y)].map(e => Array(Game_Config.MAP_SIZE.x).fill(-1));

        for(let x = 0; x < mapData[0].length - 0; x++){
            for(let y = 0; y < mapData.length - 0; y++){
                if(mapData[y][x]){
                    tileIndexData[y][x] = RuleTileSets.ConvertToTileIndex(x, y, mapData, ruleTileSet);
                } 
            }
        }

        return tileIndexData;
    }

    private convertToRuleTileData2(mapData: LandData[][]) {

        this.landDataTextureIndex = [...Array(Game_Config.MAP_SIZE.y)].map(e => Array(Game_Config.MAP_SIZE.x).fill(-1));
        this.waterDataTextureIndex = [...Array(Game_Config.MAP_SIZE.y)].map(e => Array(Game_Config.MAP_SIZE.x).fill(-1));

        for(let x = 0; x < mapData[0].length - 0; x++){
            for(let y = 0; y < mapData.length - 0; y++){
                if(mapData[y][x].isLand()){
                    this.landDataTextureIndex[y][x] = RuleTileSets.ConvertToTileIndex2({x: x, y: y}, mapData, mapData[y][x].landType);
                }
            }
        }
    }

    public updateRuleTileMap(){
        this.convertToRuleTileData2(this._mapData._landGenerator.landData);
        this.waterDataTextureIndex = this.convertToRuleTileData(this._mapData.waterData, RuleTileSets.waterTileSet);

        this.landTileLayer.putTilesAt(this.landDataTextureIndex, 0, 0);
        this.waterTileLayer.putTilesAt(this.waterDataTextureIndex, 0, 0);

        this.waterTileLayer.forEachTile((tile) => {
            let alpha = this._mapData.waterAmount[tile.y][tile.x]/Game_Config.WATER_TILE_STARTING_AMOUNT;
            tile.setAlpha(alpha);
        })

    }

    private setUpBackgrounds(): void {
                
        let cloneOfTileLayer = this._tilemap.createBlankLayer('landBeforeHoles', this.tiles, -Game_Config.MAP_tilesToWorld(0), -Game_Config.MAP_tilesToWorld(0), Game_Config.MAP_SIZE.x, Game_Config.MAP_SIZE.y, Game_Config.MAP_RES, Game_Config.MAP_RES)
        .setOrigin(0, 0)
        .setAlpha(1)
        .setScale(Game_Config.MAP_SCALE)
        .putTilesAt(this.landBeforeHolesTextureIndex, 0, 0)

        this.soilBackgroundTileLayer = this._tilemap.createBlankLayer('soilBackground', this.tiles, -Game_Config.MAP_tilesToWorld(0), -Game_Config.MAP_tilesToWorld(0), Game_Config.MAP_SIZE.x, Game_Config.MAP_SIZE.y, Game_Config.MAP_RES, Game_Config.MAP_RES)
            .setOrigin(0, 0)
            .setAlpha(0.4)
            .setScale(Game_Config.MAP_SCALE)
            .putTilesAt(this.landBeforeHolesTextureIndex, 0, 0)
            .forEachTile(tile => {
                if(tile.index != -1){
                    tile.index = (25*7) + 4;
                }
            })
    };

    private setUpTileLayers(): void {

        this.landTileLayer = this._tilemap.createBlankLayer('land', this.tiles, -Game_Config.MAP_tilesToWorld(0), -Game_Config.MAP_tilesToWorld(0), Game_Config.MAP_SIZE.x, Game_Config.MAP_SIZE.y, Game_Config.MAP_RES, Game_Config.MAP_RES)
            .setOrigin(0, 0)
            .setScale(Game_Config.MAP_SCALE)
            .putTilesAt(this.landDataTextureIndex, 0, 0)
            .setDepth(1);

        this.waterTileLayer = this._tilemap.createBlankLayer('water', this.tiles, -Game_Config.MAP_tilesToWorld(0), -Game_Config.MAP_tilesToWorld(0), Game_Config.MAP_SIZE.x, Game_Config.MAP_SIZE.y, Game_Config.MAP_RES, Game_Config.MAP_RES)
            .setOrigin(0,0)
            .setScale(Game_Config.MAP_SCALE)
            .putTilesAt(this.waterDataTextureIndex, 0, 0)
            .setDepth(1);
    }

    private setUpAnimations(): void{
        this.placeWorms(this._scene);

        this._scene.events.on(Events.RootGrowthSuccess, (pos: Position) => {
            this.addAnimFX(pos, AnimatedTile.TileDestroy, this._scene);
        })
    }

    private placeWorms(scene: Phaser.Scene): void {

        for(let x = 0; x < Game_Config.MAP_SIZE.x; x++){
            for(let y = Game_Config.MAP_UGROUND_HOLE_LEVEL; y < Game_Config.MAP_SIZE.y; y++){

                if(this._mapData._landGenerator.landData[y][x].landType === LandTypes.Hole){
                    let threshold = Math.random();
                    if(threshold < 0.05){

                        let worms = new MapAnimFX({x: x, y: y}, AnimatedTile.Worm, scene, this.mapAnimFX, 1000, false);
                        this.mapAnimFX.push(worms);

                    } 
                    // else if(threshold < 0.08){

                    //     let mushrooms = new MapAnimFX({x: x, y: y}, AnimatedTile.Mushroom, scene, this.mapAnimFX, 100, false);
                    //     this.mapAnimFX.push(mushrooms);
                    // }
                }
            }
        }
    }

    public addAnimFX(pos: Position, anim: AnimatedTile, scene: Phaser.Scene){

        let newFX = new MapAnimFX(pos, anim, scene, this.mapAnimFX, 100);

        this._mapAnimFX.push(newFX);

    }


}