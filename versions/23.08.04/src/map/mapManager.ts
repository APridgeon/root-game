import Perlin from 'phaser3-rex-plugins/plugins/perlin.js';
import RuleTileMapDisplay from "./display/mapDisplay";
import MapData from './data/mapData';
import { Position } from '../plant/plantData';
import BodyOfWater from './data/bodyOfWater';
import { Events } from '../events/events';
import Game_Config from '../game_config';

export default class MapManager {

    noise: Perlin;
    mapData: MapData;
    mapDisplay: RuleTileMapDisplay;

    constructor(scene: Phaser.Scene, noise: Perlin){

        this.noise = noise;

        this.mapData = new MapData(this.noise);

        this.mapDisplay = new RuleTileMapDisplay(scene, this.mapData, 'plantTiles');

        scene.events.on(Events.RemoveWater, (waterSources: Position[]) => {

            waterSources.forEach(pos => {
                this.mapData.bodiesOfWater.forEach(waterBody => {
                    // identify waterbody in contact
                    if(waterBody.positions.some(pos2 => pos.x === pos2.x && pos.y === pos2.y)){
                        //remove water and find unconnected
                        waterBody.active = true;
                        this.RemoveWater(waterBody);
                        let unconnected = waterBody.checkIfWhole(pos);
                        if(unconnected.length > 0){
                            this.mapData.bodiesOfWater.push( new BodyOfWater(this.mapData.bodiesOfWater.length + 1, unconnected, this.mapData));
                        }

                    }
                })
            })

        })

        scene.events.on(Events.DeadRootToLand, (deadRootPos: Position[]) => {
            deadRootPos.forEach(pos => {
                if(pos.y > Game_Config.MAP_GROUND_LEVEL){
                    this.mapData.deadRootPos[pos.y][pos.x] = true;
                    this.mapData.landData[pos.y][pos.x] = true;
                }
            })
        })


    }


    public IsWorldTileAccessable(tilePos: Position): boolean {;

        let land = this.mapData.landData[tilePos.y][tilePos.x];
        let water = this.mapData.waterData[tilePos.y][tilePos.x];

        let result = (land && !water);

        return result
    }

    public FindAccessableRoute(startPos: Position, endPos: Position): Position[] {
        //TODO
        //path finding algorithm

        return []
    }

    public DestroyTile(pos: Position): void {
        this.mapData.landData[pos.y][pos.x] = false;
        this.mapData.deadRootPos[pos.y][pos.x] = false;
    }


    public RemoveWater(waterBody: BodyOfWater): string{
        let chosenToBeAffected = waterBody.chooseWaterTileToBeAffected();
        this.mapData.waterAmount[chosenToBeAffected.y][chosenToBeAffected.x] -= 1;
        console.log(this.mapData.waterAmount[chosenToBeAffected.y][chosenToBeAffected.x] );
        if(this.mapData.waterAmount[chosenToBeAffected.y][chosenToBeAffected.x] < 0){
            waterBody.removeWaterTile(chosenToBeAffected);
            this.mapData.waterAmount[chosenToBeAffected.y][chosenToBeAffected.x] = 0;
            this.mapData.waterData[chosenToBeAffected.y][chosenToBeAffected.x]=false;
        }

        return "Done";
    }

    public inactivateWaterBodies(): void {
        this.mapData.bodiesOfWater.forEach(waterBody => {
            waterBody.active = false;
        });
    }

}


