import * as Phaser from 'phaser';
import Game_Config from '../../game_config';
import MapData from '../data/mapData';
import RuleTileSets, { RuleTile, TileResultOption } from './ruleTileSets';
import { AnimatedTile } from './animatedTiles';
import MapAnimFX from './mapAnimFX';
import { Position } from '../../plant/plantData';
import { Events } from '../../events/events';
import SkyManager from './skyManager';
import { LandTypes } from '../data/landGenerator';
import LandData from '../data/landData';
import Biome from '../data/biomeManager';


export default class RuleTileMapDisplay
{
    private _scene: Phaser.Scene;
    private _mapData: MapData;

    tilemap: Phaser.Tilemaps.Tilemap;

    private tiles: Phaser.Tilemaps.Tileset;

    private landTileLayer: Phaser.Tilemaps.TilemapLayer;
    private waterTileLayer: Phaser.Tilemaps.TilemapLayer;
    decorationLayer: Phaser.Tilemaps.TilemapLayer;
    mineralLayer: Phaser.Tilemaps.TilemapLayer;


    mapAnimFX: MapAnimFX[] = [];

    private soilBackgroundTileLayer: Phaser.Tilemaps.TilemapLayer;


    constructor(scene: Phaser.Scene, mapData: MapData, texture: string){

        this._scene = scene;
        this._mapData = mapData;

        this.tilemap = scene.make.tilemap({tileWidth: Game_Config.MAP_RES, tileHeight: Game_Config.MAP_RES, width: Game_Config.MAP_SIZE.x, height: Game_Config.MAP_SIZE.y});
        this.tiles = this.tilemap.addTilesetImage(texture, null, Game_Config.MAP_RES, Game_Config.MAP_RES, 0, 0);

        this.setupIndexes(this._mapData.landGenerator.landData);
        this.create_tilemap_layers(this._mapData.landGenerator.landData);
        this.setUpAnimations();

        new SkyManager(scene);

        this.InitialiseTilemap();


    }

    //combine set up indexes and set up tile layers - landdata doesnt need to hold indexes only tilemap layers
    setupIndexes(mapData: LandData[][]){
        mapData.forEach(row => row.forEach(tile => {
            const {x, y} = tile.pos
            const indexes = RuleTileSets.convertToIndexes(tile)
            tile.display_indexes.land = indexes.land;
            tile.display_indexes.water = indexes.water;
            tile.display_indexes.land_background = (tile.landType !== LandTypes.None) ? RuleTileSets.ConvertToTileIndex(x, y, this._mapData.landGenerator.landDataBeforeHoles, RuleTileSets.landTileSet) : -1
        }))
    }


    public InitialiseTilemap(){
        this._mapData.landGenerator.landData.forEach(row => {
            row.forEach(land => {
                this.decorationLayer.putTileAt(land.biomeIndex.index, land.pos.x + land.biomeIndex.pos.x, land.pos.y + land.biomeIndex.pos.y);
                if(land.phosphorous){
                    this.mineralLayer.putTileAt((5 * 25) + 9, land.pos.x, land.pos.y);
                }
            })
        })
    }

    updateTile(pos: Position): void {
        const N: Position = {x: pos.x, y: pos.y - 1};
        const E: Position = {x: pos.x + 1, y: pos.y};
        const S: Position = {x: pos.x, y: pos.y + 1};
        const W: Position = {x: pos.x - 1, y: pos.y};

        const tileArray = [N, E, S, W, pos];
        const landData = this._mapData.landGenerator.landData

        tileArray.forEach(tile => {
            const land_tile = landData[tile.y][tile.x]
            if(land_tile === undefined) return;

            if(land_tile.isLand()){
                const indeces = RuleTileSets.convertToIndexes(land_tile);
                this.landTileLayer.putTileAt(indeces.land, tile.x, tile.y);
                const alpha = land_tile.water/Game_Config.WATER_TILE_STARTING_AMOUNT;
                this.waterTileLayer.putTileAt(indeces.water, tile.x, tile.y).setAlpha(alpha)
            } else {
                this.landTileLayer.putTileAt(RuleTileSets.landTileSet.get(RuleTile.empty), tile.x, tile.y)
            }

            if(land_tile.phosphorous) this.mineralLayer.putTileAt((5 * 25) + 9, land_tile.pos.x, land_tile.pos.y);
        })
    }

    private create_tilemap_layers(mapData: LandData[][]): void {

        const tilemap_layers = new Map<string, Phaser.Tilemaps.TilemapLayer>();
        ['landBeforeHoles', 'soilBackground', 'land', 'decoration', 'water', 'mineral'].forEach(layer => {
            const layer_object = this.tilemap.createBlankLayer(layer, this.tiles, -Game_Config.MAP_tilesToWorld(0), -Game_Config.MAP_tilesToWorld(0))
                .setOrigin(0,0)
                .setScale(Game_Config.MAP_SCALE)
                .setDepth(1)
            tilemap_layers.set(layer, layer_object)
        })

        tilemap_layers.get('landBeforeHoles').putTilesAt(mapData.map(row => row.map(tile => tile.display_indexes.land_background)), 0, 0)
        tilemap_layers.get('land').putTilesAt(mapData.map(row => row.map(tile => tile.display_indexes.land)), 0, 0)
        tilemap_layers.get('water').putTilesAt(mapData.map(row => row.map(tile => tile.display_indexes.water)), 0, 0)
        tilemap_layers.get('soilBackground')
            .setAlpha(0.4)
            .putTilesAt(mapData.map(row => row.map(tile => tile.display_indexes.land_background)), 0, 0)
            .forEachTile(tile => tile.index = (tile.index != -1) ?  (25*7) + 4 : -1)


        this.soilBackgroundTileLayer = tilemap_layers.get('soilBackground')
        this.landTileLayer = tilemap_layers.get('land')
        this.waterTileLayer = tilemap_layers.get('water')
        this.decorationLayer = tilemap_layers.get('decoration')
        this.mineralLayer = tilemap_layers.get('mineral')

    }


    private setUpAnimations(): void{
        this.placeWorms(this._scene);
        this._scene.events.on(Events.RootGrowthSuccess, (pos: Position) => {
            this.addAnimFX(pos, AnimatedTile.TileDestroy, this._scene);
        })
    }

    private placeWorms(scene: Phaser.Scene): void {
        this._mapData.landGenerator.landData.forEach(row => row.forEach(tile => {
            if(tile.landType === LandTypes.Hole && Math.random() < 0.05){
                const {x, y} = tile.pos
                const worm = new MapAnimFX({x: x, y: y}, AnimatedTile.Worm, scene, this.mapAnimFX, 1000, false);
                this.mapAnimFX.push(worm)
            }
        }))
    }

    public addAnimFX(pos: Position, anim: AnimatedTile, scene: Phaser.Scene){
        let newFX = new MapAnimFX(pos, anim, scene, this.mapAnimFX, 100);
        this.mapAnimFX.push(newFX);
    }


}