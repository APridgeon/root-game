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

        this.mapData = new MapData(this.noise, this);

        this.mapDisplay = new RuleTileMapDisplay(scene, this.mapData, 'plantTiles');

        scene.events.on(Events.DeadRootToLand, (deadRootPos: Position[]) => {
            deadRootPos.forEach(pos => {
                    this.mapData._landGenerator.landData[pos.y][pos.x].landType = LandTypes.DeadRoot;
                    this.mapData._landGenerator.landData[pos.y][pos.x].landStrength = 2;
            })
        })




    }


    public isLandTileAccessible(pos: Position): boolean {

        let result = false;

        if(!pos){
            return false;
        }

        if(!this.mapData._landGenerator.landData[pos.y][pos.x]){
            console.log(JSON.stringify(pos) + " is not accessible")
            return false;
        }

        if(this.mapData._landGenerator.landData[pos.y][pos.x].isLand()){
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

 
    /**
     * 
     * @param pos Position of tile to be destroyed
     * @returns If tile is destroyed position is returned
     */
    public DestroyTile(pos: Position): Position|void {
        this.mapData._landGenerator.landData[pos.y][pos.x].destroy();
    }

    public AttackTile(pos: Position, plant: PlantData){
        let destroyed = this.mapData._landGenerator.landData[pos.y][pos.x].attack(plant);
        if(destroyed){
            return pos;
        }
    }

}


