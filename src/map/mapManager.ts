import Perlin from 'phaser3-rex-plugins/plugins/perlin.js';
import RuleTileMapDisplay from "./display/mapDisplay";
import MapData from './data/mapData';
import { Position } from '../plant/plantData';
import { Events } from '../events/events';
import Game_Config from '../game_config';
import { LandTypes } from './data/landGenerator';

export default class MapManager {

    noise: Perlin;
    mapData: MapData;
    mapDisplay: RuleTileMapDisplay;

    constructor(scene: Phaser.Scene, noise: Perlin){

        this.noise = noise;

        this.mapData = new MapData(this.noise, this);

        this.mapDisplay = new RuleTileMapDisplay(scene, this.mapData, 'plantTiles');

        scene.events.on(Events.DeadRootToLand, (deadRootPos: Position[]) => {
            deadRootPos.forEach(pos => {
                    this.mapData.landData2[pos.y][pos.x] = LandTypes.DeadRoot;
            })
        })


    }


    public isLandTileAccessible(pos: Position): boolean {

        let result = false;

        if(this.mapData.landData2[pos.y][pos.x] === LandTypes.DeadRoot || 
            this.mapData.landData2[pos.y][pos.x] === LandTypes.Normal ||
            this.mapData.landData2[pos.y][pos.x] === LandTypes.Sandy){
                result = true;
            }
        
        if(this.mapData.waterData[pos.y][pos.x]){
            result = false;
        }

        return result;

    }

    public FindAccessableRoute(startPos: Position, endPos: Position): Position[] {
        //TODO
        //path finding algorithm

        return []
    }

    public DestroyTile(pos: Position): void {
        this.mapData.landData2[pos.y][pos.x] = LandTypes.Hole;
    }



}


