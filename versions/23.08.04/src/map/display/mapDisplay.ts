import * as Phaser from 'phaser';
import Game_Config from '../../game_config';
import MapData from '../data/mapData';
import RuleTileSets, { RuleTile } from './ruleTileSets';
import { AnimatedTile } from './animatedTiles';
import MapAnimFX from './mapAnimFX';
import { Position } from '../../plant/plantData';
import { Events } from '../../events/events';
import SkyManager from './skyManager';



export default class RuleTileMapDisplay
{
    private _scene: Phaser.Scene;
    private _mapData: MapData;
    private _texture: string;

    private landDataTextureIndex: number[][] = [...Array(Game_Config.MAP_SIZE)].map(e => Array(Game_Config.MAP_SIZE).fill(-1));
    private waterDataTextureIndex: number[][] = [...Array(Game_Config.MAP_SIZE)].map(e => Array(Game_Config.MAP_SIZE).fill(-1));
    
    private _tilemap: Phaser.Tilemaps.Tilemap;
    get tilemap(){
        return this._tilemap
    }

    private tiles: Phaser.Tilemaps.Tileset;
    private soilTiles: Phaser.Tilemaps.Tileset;

    private landTileLayer: Phaser.Tilemaps.TilemapLayer;
    private waterTileLayer: Phaser.Tilemaps.TilemapLayer;

    private clouds: Phaser.GameObjects.Image;
    private updateAnimTime: number = 500;

    private _mapAnimFX: MapAnimFX[] = [];
    get mapAnimFX(){
        return this._mapAnimFX;
    }


    constructor(scene: Phaser.Scene, mapData: MapData, texture: string){

        this._scene = scene;
        this._mapData = mapData;
        this._texture = texture;

        // this.convertToRuleTileData2();
        this.landDataTextureIndex = this.convertToRuleTileData(this._mapData.landData, RuleTileSets.landTileSet);
        this.waterDataTextureIndex = this.convertToRuleTileData(this._mapData.waterData, RuleTileSets.waterTileSet);

        this._tilemap = scene.make.tilemap({tileWidth: Game_Config.MAP_RES, tileHeight: Game_Config.MAP_RES, width: Game_Config.MAP_SIZE, height: Game_Config.MAP_SIZE});
        this.tiles = this._tilemap.addTilesetImage(texture, null, Game_Config.MAP_RES, Game_Config.MAP_RES, 0, 0);

        new SkyManager(this._tilemap, scene);
        this.setUpBackgrounds();
        this.setUpTileLayers();
        this.setUpAnimations();

    }

    private convertToRuleTileData(mapData: boolean[][], ruleTileSet: Map<RuleTile, integer>): number[][] {

        let tileIndexData = [...Array(Game_Config.MAP_SIZE)].map(e => Array(Game_Config.MAP_SIZE).fill(-1));

        for(let x = 0; x < mapData[0].length - 0; x++){
            for(let y = 0; y < mapData.length - 0; y++){
                if(mapData[y][x]){
                    tileIndexData[y][x] = RuleTileSets.ConvertToTileIndex(x, y, mapData, ruleTileSet);
                } 
            }
        }

        return tileIndexData;
    }


    private addRuleTileData(mapData: boolean[][], ruleTileSet: Map<RuleTile, integer>, textureIndex: number[][]){

        for(let x = 0; x < mapData[0].length - 0; x++){
            for(let y = 0; y < mapData.length - 0; y++){
                if(mapData[y][x]){
                    textureIndex[y][x] = RuleTileSets.ConvertToTileIndex(x, y, mapData, ruleTileSet);
                } 
            }
        }

    }

    public updateRuleTileMap(){

        // this.convertToRuleTileData2();
        this.landDataTextureIndex = this.convertToRuleTileData(this._mapData.landData, RuleTileSets.landTileSet);
        this.addRuleTileData(this._mapData.deadRootPos, RuleTileSets.deadRootTileSet, this.landDataTextureIndex);
        this.waterDataTextureIndex = this.convertToRuleTileData(this._mapData.waterData, RuleTileSets.waterTileSet);

        this.landTileLayer.putTilesAt(this.landDataTextureIndex, 0, 0);
        this.waterTileLayer.putTilesAt(this.waterDataTextureIndex, 0, 0);

        this._mapData.bodiesOfWater.forEach(waterbody => {
            let col = (waterbody.active) ? 0xffaaaa : 0xffffff;
            waterbody.positions.forEach(pos => {
                let tile = this.waterTileLayer.getTileAt(pos.x, pos.y, true);
                tile.tint = col;
            })
        })
    }

    private setUpBackgrounds(): void {
        let SOIL_RES = 100;
        this.soilTiles = this._tilemap.addTilesetImage('soil', null, SOIL_RES, SOIL_RES, 0, 0);
        
        this._tilemap.createBlankLayer('soilBackground', this.soilTiles, 0, Game_Config.MAP_tilesToWorld(Game_Config.MAP_GROUND_LEVEL), Game_Config.MAP_tilesToWorld(Game_Config.MAP_SIZE)/SOIL_RES)
            .setOrigin(0,0)
            .setScale((Game_Config.MAP_SCALE/Game_Config.MAP_RES)*SOIL_RES)
            .setAlpha(0.4)
            .forEachTile(tile => tile.index = 0);
    };

    private setUpTileLayers(): void {

        this.landTileLayer = this._tilemap.createBlankLayer('land', this.tiles, -Game_Config.MAP_tilesToWorld(0), -Game_Config.MAP_tilesToWorld(0), Game_Config.MAP_SIZE, Game_Config.MAP_SIZE, Game_Config.MAP_RES, Game_Config.MAP_RES)
            .setOrigin(0, 0)
            .setScale(Game_Config.MAP_SCALE)
            .putTilesAt(this.landDataTextureIndex, 0, 0);

        this.waterTileLayer = this._tilemap.createBlankLayer('water', this.tiles, -Game_Config.MAP_tilesToWorld(0), -Game_Config.MAP_tilesToWorld(0), Game_Config.MAP_SIZE, Game_Config.MAP_SIZE, Game_Config.MAP_RES, Game_Config.MAP_RES)
            .setOrigin(0,0)
            .setScale(Game_Config.MAP_SCALE)
            .putTilesAt(this.waterDataTextureIndex, 0, 0);
    }

    private setUpAnimations(): void{
        this.placeWorms(this._scene);

        this._scene.events.on(Events.RootGrowthSuccess, (pos: Position) => {
            this.addAnimFX(pos, AnimatedTile.TileDestroy, this._scene);
        })
    }

    public updateAnims(time: Number){
        this._mapAnimFX.forEach(anim => {
            anim.update(time);
        })
    }

    private placeWorms(scene: Phaser.Scene): void {

        for(let x = 0; x < Game_Config.MAP_SIZE; x++){
            for(let y = Game_Config.MAP_UGROUND_HOLE_LEVEL; y < Game_Config.MAP_SIZE; y++){

                if(!this._mapData.landData[y][x]){
                    let threshold = Math.random();
                    if(threshold < 0.05){

                        let worms = new MapAnimFX({x: x, y: y}, AnimatedTile.Worm, scene, this.mapAnimFX, 1000, false);
                        this.mapAnimFX.push(worms);

                    }
                }
            }
        }
    }

    public addAnimFX(pos: Position, anim: AnimatedTile, scene: Phaser.Scene){

        let newFX = new MapAnimFX(pos, anim, scene, this.mapAnimFX, 100);

        this._mapAnimFX.push(newFX);

    }


}