import Perlin from 'phaser3-rex-plugins/plugins/perlin.js';
import RuleTileMapDisplay from "./display/mapDisplay";
import MapData from './data/mapData';
import PlantData, { Position } from '../plant/plantData';
import { Events } from '../events/events';
import Game_Config from '../game_config';
import { LandTypes } from './data/landGenerator';

export default class MapManager {

    noise: Perlin;
    mapData: MapData;
    mapDisplay: RuleTileMapDisplay;

    constructor(scene: Phaser.Scene, noise: Perlin){

        this.noise = noise;

        this.mapData = new MapData(this.noise, this, scene);

        this.mapDisplay = new RuleTileMapDisplay(scene, this.mapData, 'plantTiles');

        scene.events.on(Events.DeadRootToLand, (deadRootPos: Position[]) => {
            deadRootPos.forEach(pos => {
                    this.mapData.landGenerator.landData[pos.y][pos.x].landType = LandTypes.DeadRoot;
                    this.mapData.landGenerator.landData[pos.y][pos.x].landStrength = 2;
                    this.mapDisplay.updateTile(pos);
            })
        })
    }


    public isLandTileAccessible(pos: Position): boolean {
        if(!pos) return false;
        const tile = this.mapData.landGenerator.landData[pos.y][pos.x];
        return (tile.isLand() && !tile.hasWater()) 
    }

    public isLandTileSurface(pos: Position): boolean {
        if(!pos) return false;
        const tile = this.mapData.landGenerator.landData[pos.y][pos.x];
        const above_tile = this.mapData.landGenerator.landData[pos.y-1][pos.x];
        return (tile.isLand() && !above_tile.isLand())


    public FindAccessableRoute(startPos: Position, endPos: Position): Position[] {
        //TODO
        //path finding algorithm

        return []
    }

    public DestroyTile(pos: Position): Position|void {
        this.mapData.landGenerator.landData[pos.y][pos.x].destroy();
    }

    public AttackTile(pos: Position, plant: PlantData){
        const is_destroyed = this.mapData.landGenerator.landData[pos.y][pos.x].attack(plant);
        if(is_destroyed) this.mapDisplay.updateTile(pos);
        return is_destroyed
    }

}


