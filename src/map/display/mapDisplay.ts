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
import Biome from '../data/biomeManager';


export default class RuleTileMapDisplay
{
    private _scene: Phaser.Scene;
    private _mapData: MapData;
    private _texture: string;

    private landDataTextureIndex: number[][] = [...Array(Game_Config.MAP_SIZE.y)].map(e => Array(Game_Config.MAP_SIZE.x).fill(-1));
    private waterDataTextureIndex: number[][] = [...Array(Game_Config.MAP_SIZE.y)].map(e => Array(Game_Config.MAP_SIZE.x).fill(-1));
    private landBeforeHolesTextureIndex: number[][] =  [...Array(Game_Config.MAP_SIZE.y)].map(e => Array(Game_Config.MAP_SIZE.x).fill(-1));
    
    tilemap: Phaser.Tilemaps.Tilemap;

    private tiles: Phaser.Tilemaps.Tileset;
    private soilTiles: Phaser.Tilemaps.Tileset;

    private landTileLayer: Phaser.Tilemaps.TilemapLayer;
    private waterTileLayer: Phaser.Tilemaps.TilemapLayer;
    decorationLayer: Phaser.Tilemaps.TilemapLayer;
    mineralLayer: Phaser.Tilemaps.TilemapLayer;


    mapAnimFX: MapAnimFX[] = [];

    private soilBackgroundTileLayer: Phaser.Tilemaps.TilemapLayer;


    constructor(scene: Phaser.Scene, mapData: MapData, texture: string){

        this._scene = scene;
        this._mapData = mapData;
        this._texture = texture;

        this.convertToRuleTileData2(this._mapData.landGenerator.landData);
        this.waterDataTextureIndex = this.convertToRuleTileData_water(this._mapData.landGenerator.landData, RuleTileSets.waterTileSet);
        this.landBeforeHolesTextureIndex = this.convertToRuleTileData(this._mapData.landDataBeforeHoles, RuleTileSets.landTileSet);


        this.tilemap = scene.make.tilemap({tileWidth: Game_Config.MAP_RES, tileHeight: Game_Config.MAP_RES, width: Game_Config.MAP_SIZE.x, height: Game_Config.MAP_SIZE.y});
        this.tiles = this.tilemap.addTilesetImage(texture, null, Game_Config.MAP_RES, Game_Config.MAP_RES, 0, 0);

        new SkyManager(scene);
        this.setUpTileLayers();
        this.setUpBackgrounds();
        this.setUpAnimations();
        this._mapData.biomeManager.addImages();
        this._mapData.biomeManager.addMinerals();


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

    private convertToRuleTileData_water(landData: LandData[][], ruleTileSet: Map<RuleTile, integer>): number[][] {

        let tileIndexData = [...Array(Game_Config.MAP_SIZE.y)].map(e => Array(Game_Config.MAP_SIZE.x).fill(-1));

        landData.forEach(row => {
            row.forEach(land => {
                if(land.isLand()){
                    tileIndexData[land.pos.y][land.pos.x] =  RuleTileSets.ConvertToTileIndex_water(land.pos.x, land.pos.y, landData, ruleTileSet);
                }
            })
        })

        return tileIndexData;
    }

    private convertToRuleTileData2(mapData: LandData[][]) {

        this.landDataTextureIndex = [...Array(Game_Config.MAP_SIZE.y)].map(e => Array(Game_Config.MAP_SIZE.x).fill(-1));
        this.waterDataTextureIndex = [...Array(Game_Config.MAP_SIZE.y)].map(e => Array(Game_Config.MAP_SIZE.x).fill(-1));

        for(let x = 0; x < mapData[0].length - 0; x++){
            for(let y = 0; y < mapData.length - 0; y++){
                if(mapData[y][x].isLand()){
                    let results = RuleTileSets.ConvertToTileIndex2({x: x, y: y}, mapData, mapData[y][x].landType);
                    this.landDataTextureIndex[y][x] = results.tileIndex;
                    mapData[y][x].ruleTile = results.tileType;
                }
            }
        }
    }

    public updateRuleTileMap(){
        this.convertToRuleTileData2(this._mapData.landGenerator.landData);
        this.waterDataTextureIndex = this.convertToRuleTileData_water(this._mapData.landGenerator.landData, RuleTileSets.waterTileSet);

        this.landTileLayer.putTilesAt(this.landDataTextureIndex, 0, 0);
        this.waterTileLayer.putTilesAt(this.waterDataTextureIndex, 0, 0);

        this._mapData.landGenerator.landData.forEach(row => {
            row.forEach(land => {
                this.decorationLayer.putTileAt(land.biomeIndex.index, land.pos.x + land.biomeIndex.pos.x, land.pos.y + land.biomeIndex.pos.y);
                if(land.phosphorous){
                    this.mineralLayer.putTileAt((5 * 25) + 9, land.pos.x, land.pos.y);
                }
            })
        })

        this.waterTileLayer.forEachTile((tile) => {
            let alpha = this._mapData.landGenerator.landData[tile.y][tile.x].water/Game_Config.WATER_TILE_STARTING_AMOUNT;
            tile.setAlpha(alpha);
        })

    }

    updateTile(pos: Position): void {
        let N: Position = {x: pos.x, y: pos.y - 1};
        let E: Position = {x: pos.x + 1, y: pos.y};
        let S: Position = {x: pos.x, y: pos.y + 1};
        let W: Position = {x: pos.x - 1, y: pos.y};

        let tileArray = [N, E, S, W, pos];
        let landData = this._mapData.landGenerator.landData

        // tileArray.forEach(tile => {
        //     if(landData[tile.y][tile.x] === undefined){
        //         return
        //     }
        //     let results = RuleTileSets.convertToIndexes(landData[tile.y][tile.x]);
        //     this.landTileLayer.putTileAt(results.land.tileIndex, tile.x, tile.y);
        //     this.waterTileLayer.putTileAt(results.water.tileIndex, tile.x, tile.y)
        //         .setAlpha(landData[tile.y][tile.x].water / Game_Config.WATER_TILE_STARTING_AMOUNT);
        //     if(landData[tile.y][tile.x].phosphorous){
        //         this.mineralLayer.putTileAt((5 * 25) + 9, landData[tile.y][tile.x].pos.x, landData[tile.y][tile.x]  .pos.y);
        //     }
        // })

        tileArray.forEach(tile => {
            if(landData[tile.y][tile.x] === undefined){
                console.log("Tile is not found");
                return
            }

            if(landData[tile.y][tile.x].phosphorous){
                this.mineralLayer.putTileAt((5 * 25) + 9, landData[tile.y][tile.x].pos.x, landData[tile.y][tile.x]  .pos.y);
            }


            if(landData[tile.y][tile.x].isLand()){
                let results = RuleTileSets.ConvertToTileIndex2(tile, landData, landData[tile.y][tile.x].landType);
                this.landTileLayer.putTileAt(results.tileIndex, tile.x, tile.y);
                landData[tile.y][tile.x].ruleTile = results.tileType;
            }
            else {
                this.landTileLayer.putTileAt(RuleTileSets.landTileSet.get(RuleTile.empty), tile.x, tile.y);
            }
            
            if(landData[tile.y][tile.x].water > 0){
                let index = RuleTileSets.ConvertToTileIndex_water(tile.x, tile.y, landData, RuleTileSets.waterTileSet);
                let alpha = landData[tile.y][tile.x].water/Game_Config.WATER_TILE_STARTING_AMOUNT;
                this.waterTileLayer.putTileAt(index, tile.x, tile.y)
                    .setAlpha(alpha)
            } 
            else {
                this.waterTileLayer.putTileAt(RuleTileSets.waterTileSet.get(RuleTile.empty), tile.x, tile.y);
            }
        })

    }

    private setUpBackgrounds(): void {
                
        let cloneOfTileLayer = this.tilemap.createBlankLayer('landBeforeHoles', this.tiles, -Game_Config.MAP_tilesToWorld(0), -Game_Config.MAP_tilesToWorld(0), Game_Config.MAP_SIZE.x, Game_Config.MAP_SIZE.y, Game_Config.MAP_RES, Game_Config.MAP_RES)
            .setOrigin(0, 0)
            .setAlpha(1)
            .setScale(Game_Config.MAP_SCALE)
            .putTilesAt(this.landBeforeHolesTextureIndex, 0, 0)

        this.soilBackgroundTileLayer = this.tilemap.createBlankLayer('soilBackground', this.tiles, -Game_Config.MAP_tilesToWorld(0), -Game_Config.MAP_tilesToWorld(0), Game_Config.MAP_SIZE.x, Game_Config.MAP_SIZE.y, Game_Config.MAP_RES, Game_Config.MAP_RES)
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

        this.landTileLayer = this.tilemap.createBlankLayer('land', this.tiles, -Game_Config.MAP_tilesToWorld(0), -Game_Config.MAP_tilesToWorld(0), Game_Config.MAP_SIZE.x, Game_Config.MAP_SIZE.y, Game_Config.MAP_RES, Game_Config.MAP_RES)
            .setOrigin(0, 0)
            .setScale(Game_Config.MAP_SCALE)
            .putTilesAt(this.landDataTextureIndex, 0, 0)
            .setDepth(1);

        this.waterTileLayer = this.tilemap.createBlankLayer('water', this.tiles, -Game_Config.MAP_tilesToWorld(0), -Game_Config.MAP_tilesToWorld(0), Game_Config.MAP_SIZE.x, Game_Config.MAP_SIZE.y, Game_Config.MAP_RES, Game_Config.MAP_RES)
            .setOrigin(0,0)
            .setScale(Game_Config.MAP_SCALE)
            .putTilesAt(this.waterDataTextureIndex, 0, 0)
            .setDepth(1);

        this.decorationLayer = this.tilemap.createBlankLayer('decoration', this.tiles, -Game_Config.MAP_tilesToWorld(0), -Game_Config.MAP_tilesToWorld(0), Game_Config.MAP_SIZE.x, Game_Config.MAP_SIZE.y, Game_Config.MAP_RES, Game_Config.MAP_RES)
            .setOrigin(0,0)
            .setScale(Game_Config.MAP_SCALE)
            .setDepth(1);

        this.mineralLayer = this.tilemap.createBlankLayer('mineral', this.tiles, -Game_Config.MAP_tilesToWorld(0), -Game_Config.MAP_tilesToWorld(0), Game_Config.MAP_SIZE.x, Game_Config.MAP_SIZE.y, Game_Config.MAP_RES, Game_Config.MAP_RES)
            .setOrigin(0,0)
            .setScale(Game_Config.MAP_SCALE)
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

                if(this._mapData.landGenerator.landData[y][x].landType === LandTypes.Hole){
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

        this.mapAnimFX.push(newFX);

    }


}