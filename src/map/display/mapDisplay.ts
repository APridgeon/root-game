import * as Phaser from 'phaser';
import Game_Config from '../../game_config';
import MapData from '../data/mapData';
import RuleTileSets from './ruleTileSets';
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

    tilemap: Phaser.Tilemaps.Tilemap;
    tiles: Phaser.Tilemaps.Tileset;
    tilemap_layers: Map<string, Phaser.Tilemaps.TilemapLayer>;

    mapAnimFX: MapAnimFX[] = [];

    constructor(scene: Phaser.Scene, mapData: MapData, texture: string){

        this._scene = scene;
        this._mapData = mapData;

        this.tilemap = scene.make.tilemap({tileWidth: Game_Config.MAP_RES, tileHeight: Game_Config.MAP_RES, width: Game_Config.MAP_SIZE.x, height: Game_Config.MAP_SIZE.y});
        this.tiles = this.tilemap.addTilesetImage(texture, null, Game_Config.MAP_RES, Game_Config.MAP_RES, 0, 0);

        this.create_tilemap_layers(this._mapData.landGenerator.landData);
        this.setUpAnimations();

        new SkyManager(scene);
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

            const indeces = RuleTileSets.convertToIndexes(land_tile);        
            const {x: off_x, y:off_y} = land_tile.biomeIndex.pos;
            const alpha = land_tile.water/Game_Config.WATER_TILE_STARTING_AMOUNT;

            this.tilemap_layers.get('land').putTileAt(indeces.land, tile.x, tile.y);
            this.tilemap_layers.get('water').putTileAt(indeces.water, tile.x, tile.y).setAlpha(alpha)
            this.tilemap_layers.get('mineral').putTileAt(indeces.mineral, tile.x, tile.y)
            this.tilemap_layers.get('decoration').putTileAt(land_tile.biomeIndex.index, tile.x+off_x, tile.y+off_y)

        })
    }

    private create_tilemap_layers(mapData: LandData[][]): void {

        this.tilemap_layers = new Map<string, Phaser.Tilemaps.TilemapLayer>();
        ['landBeforeHoles', 'soilBackground', 'land', 'decoration', 'water', 'mineral'].forEach(layer => {
            const layer_object = this.tilemap.createBlankLayer(layer, this.tiles, -Game_Config.MAP_tilesToWorld(0), -Game_Config.MAP_tilesToWorld(0))
                .setOrigin(0,0)
                .setScale(Game_Config.MAP_SCALE)
                .setDepth(1)
            this.tilemap_layers.set(layer, layer_object)
        })

        const indeces = mapData.map(row => row.map(tile => RuleTileSets.convertToIndexes(tile)))
        this.tilemap_layers.get('landBeforeHoles').putTilesAt(indeces.map(row => row.map(tile => tile.background)), 0, 0)
        this.tilemap_layers.get('soilBackground').putTilesAt(indeces.map(row => row.map(tile => (tile.background != -1) ? (25*7) + 4 : -1)), 0, 0)
            .setAlpha(0.4)
        this.tilemap_layers.get('land').putTilesAt(indeces.map(row => row.map(tile => tile.land)), 0, 0)
        this.tilemap_layers.get('water').putTilesAt(indeces.map(row => row.map(tile => tile.water)), 0, 0)
        this.tilemap_layers.get('mineral').putTilesAt(indeces.map(row => row.map(tile => tile.mineral)), 0, 0)

        mapData.forEach(row => row.forEach(tile => {
            const {x, y} = tile.pos;
            const {x: off_x, y:off_y} = tile.biomeIndex.pos;
            this.tilemap_layers.get('decoration').putTileAt(tile.biomeIndex.index, x+off_x, y+off_y)
        }))
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