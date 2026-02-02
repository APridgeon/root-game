import Game_Config from "../../game_config";
import { LandTypes } from "../data/landGenerator";
import LandData from "../data/landData";

const ROWLENGTH = 25;

export enum RuleTile {
    surrounded = 'surrounded',
    top = "top",
    right = 'right',
    bottom = 'bottom',
    left = 'left',
    leftAndRight = 'leftAndRight',
    topLeft = 'topLeft',
    topRight = "topRight",
    bottomLeft = 'bottomLeft',
    bottomRight = 'bottomRight',
    stranded = 'stranded',
    topAndBottom = 'topAndBottom',
    allButLeft = 'allButLeft',
    allButRight = 'allButRight',
    allButTop = 'allButTop',
    allButBottom = 'allButBottom',
    empty = 'empty'
};

export type Direction = {
    N: boolean,
    E: boolean,
    S: boolean,
    W: boolean
}

export const Direction_to_Ruletile = new Map<string, RuleTile>([
    [JSON.stringify({N: true,   E: true,   S: true,   W: true}),    RuleTile.surrounded],
    [JSON.stringify({N: false,  E: false,  S: false,  W: false}),   RuleTile.stranded],
    [JSON.stringify({N: false,  E: true,   S: true,   W: true}),    RuleTile.top],
    [JSON.stringify({N: true,   E: false,  S: true,   W: true}),    RuleTile.right],
    [JSON.stringify({N: true,   E: true,   S: false,  W: true}),    RuleTile.bottom],
    [JSON.stringify({N: true,   E: true,   S: true,   W: false}),   RuleTile.left],
    [JSON.stringify({N: false,  E: false,  S: true,   W: true}),    RuleTile.topRight],
    [JSON.stringify({N: false,  E: true,   S: false,  W: true}),    RuleTile.topAndBottom],
    [JSON.stringify({N: true,   E: false,  S: true,   W: false}),   RuleTile.leftAndRight],
    [JSON.stringify({N: false,  E: true,   S: true,   W: false}),   RuleTile.topLeft],
    [JSON.stringify({N: true,   E: false,  S: false,  W: true}),    RuleTile.bottomRight],
    [JSON.stringify({N: true,   E: true,   S: false,  W: false}),   RuleTile.bottomLeft],
    [JSON.stringify({N: true,   E: false,  S: false,  W: false}),   RuleTile.allButTop],
    [JSON.stringify({N: false,  E: true,   S: false,  W: false}),   RuleTile.allButRight],
    [JSON.stringify({N: false,  E: false,  S: true,   W: false}),   RuleTile.allButBottom],
    [JSON.stringify({N: false,  E: false,  S: false,  W: true}),    RuleTile.allButLeft],
])


export default class RuleTileSets {

    static landTileSet = new Map<RuleTile, integer>([
        [RuleTile.surrounded, (7*ROWLENGTH) + 1],
        [RuleTile.top, (6*ROWLENGTH) + 1],
        [RuleTile.right, (7*ROWLENGTH) + 2],
        [RuleTile.bottom, (8*ROWLENGTH) + 1],
        [RuleTile.left, (7*ROWLENGTH) + 0],
        [RuleTile.topLeft, (6*ROWLENGTH) + 0],
        [RuleTile.topRight, (6*ROWLENGTH) + 2],
        [RuleTile.bottomRight, (8*ROWLENGTH) + 2],
        [RuleTile.bottomLeft, (8*ROWLENGTH) + 0],
        [RuleTile.empty, (5*ROWLENGTH) + 2],
        [RuleTile.stranded, (11*ROWLENGTH) + 0],
        [RuleTile.leftAndRight, (9*ROWLENGTH) + 1],
        [RuleTile.topAndBottom, (9*ROWLENGTH) + 0],
        [RuleTile.allButTop, (10*ROWLENGTH) + 1],
        [RuleTile.allButRight, (10*ROWLENGTH) + 2],
        [RuleTile.allButBottom, (9*ROWLENGTH) + 2],
        [RuleTile.allButLeft, (10*ROWLENGTH) + 0]
    ])

    static waterTileSet = new Map<RuleTile, integer>([
        [RuleTile.surrounded, (1*ROWLENGTH) + 1],
        [RuleTile.top, (0*ROWLENGTH) + 1],
        [RuleTile.bottom, (2*ROWLENGTH) + 1],
        [RuleTile.left, (1*ROWLENGTH) + 0],
        [RuleTile.right, (1*ROWLENGTH) + 2],
        [RuleTile.topLeft, (5*ROWLENGTH) + 1],
        [RuleTile.topRight, (0*ROWLENGTH) + 2],
        [RuleTile.bottomLeft, (2*ROWLENGTH) + 0],
        [RuleTile.bottomRight, (2*ROWLENGTH) + 2],
        [RuleTile.stranded, (5*ROWLENGTH) + 0],
        [RuleTile.leftAndRight, (3*ROWLENGTH) + 1],
        [RuleTile.topAndBottom, (3*ROWLENGTH) + 0],
        [RuleTile.allButTop, (4*ROWLENGTH) + 1],
        [RuleTile.allButRight, (4*ROWLENGTH) + 2],
        [RuleTile.allButBottom, (3*ROWLENGTH) + 2],
        [RuleTile.allButLeft, (4*ROWLENGTH) + 0],
        [RuleTile.empty, (7*ROWLENGTH) + 0]
    ])

    static deadRootTileSet = new Map<RuleTile, integer>([
        [RuleTile.surrounded, (7*ROWLENGTH) + 4],
        [RuleTile.top, (6*ROWLENGTH) + 4],
        [RuleTile.right, (7*ROWLENGTH) + 5],
        [RuleTile.bottom, (8*ROWLENGTH) + 4],
        [RuleTile.left, (7*ROWLENGTH) + 3],
        [RuleTile.topLeft, (6*ROWLENGTH) + 3],
        [RuleTile.topRight, (6*ROWLENGTH) + 5],
        [RuleTile.bottomRight, (8*ROWLENGTH) + 5],
        [RuleTile.bottomLeft, (8*ROWLENGTH) + 3],
        [RuleTile.empty, (5*ROWLENGTH) + 5],
        [RuleTile.stranded, (11*ROWLENGTH) + 3],
        [RuleTile.leftAndRight, (9*ROWLENGTH) + 4],
        [RuleTile.topAndBottom, (9*ROWLENGTH) + 3],
        [RuleTile.allButTop, (10*ROWLENGTH) + 4],
        [RuleTile.allButRight, (10*ROWLENGTH) + 5],
        [RuleTile.allButBottom, (9*ROWLENGTH) + 5],
        [RuleTile.allButLeft, (10*ROWLENGTH) + 3]
    ])

    static sandTileSet = new Map<RuleTile, integer>([
        [RuleTile.surrounded, (7*ROWLENGTH) + 7],
        [RuleTile.top, (6*ROWLENGTH) + 7],
        [RuleTile.right, (7*ROWLENGTH) + 8],
        [RuleTile.bottom, (8*ROWLENGTH) + 7],
        [RuleTile.left, (7*ROWLENGTH) + 6],
        [RuleTile.topLeft, (6*ROWLENGTH) + 6],
        [RuleTile.topRight, (6*ROWLENGTH) + 8],
        [RuleTile.bottomRight, (8*ROWLENGTH) + 8],
        [RuleTile.bottomLeft, (8*ROWLENGTH) + 6],
        [RuleTile.empty, (5*ROWLENGTH) + 8],
        [RuleTile.stranded, (11*ROWLENGTH) + 6],
        [RuleTile.leftAndRight, (9*ROWLENGTH) + 7],
        [RuleTile.topAndBottom, (9*ROWLENGTH) + 6],
        [RuleTile.allButTop, (10*ROWLENGTH) + 7],
        [RuleTile.allButRight, (10*ROWLENGTH) + 8],
        [RuleTile.allButBottom, (9*ROWLENGTH) + 8],
        [RuleTile.allButLeft, (10*ROWLENGTH) + 6]
    ])

    static landTileSetNoGaps = new Map<RuleTile, integer>([
        [RuleTile.surrounded, (13*ROWLENGTH) + 1],
        [RuleTile.top, (12*ROWLENGTH) + 1],
        [RuleTile.right, (13*ROWLENGTH) + 2],
        [RuleTile.bottom, (14*ROWLENGTH) + 1],
        [RuleTile.left, (13*ROWLENGTH) + 0],
        [RuleTile.topLeft, (12*ROWLENGTH) + 0],
        [RuleTile.topRight, (12*ROWLENGTH) + 2],
        [RuleTile.bottomRight, (14*ROWLENGTH) + 2],
        [RuleTile.bottomLeft, (14*ROWLENGTH) + 0],
        [RuleTile.empty, (5*ROWLENGTH) + 2],
        [RuleTile.stranded, (17*ROWLENGTH) + 0],
        [RuleTile.leftAndRight, (15*ROWLENGTH) + 1],
        [RuleTile.topAndBottom, (15*ROWLENGTH) + 0],
        [RuleTile.allButTop, (16*ROWLENGTH) + 1],
        [RuleTile.allButRight, (16*ROWLENGTH) + 2],
        [RuleTile.allButBottom, (15*ROWLENGTH) + 2],
        [RuleTile.allButLeft, (16*ROWLENGTH) + 0]
    ])

    static deadRootTileSetNoGaps = new Map<RuleTile, integer>([
        [RuleTile.surrounded, (13*ROWLENGTH) + 4],
        [RuleTile.top, (12*ROWLENGTH) + 4],
        [RuleTile.right, (13*ROWLENGTH) + 5],
        [RuleTile.bottom, (14*ROWLENGTH) + 4],
        [RuleTile.left, (13*ROWLENGTH) + 3],
        [RuleTile.topLeft, (12*ROWLENGTH) + 3],
        [RuleTile.topRight, (12*ROWLENGTH) + 5],
        [RuleTile.bottomRight, (14*ROWLENGTH) + 5],
        [RuleTile.bottomLeft, (14*ROWLENGTH) + 3],
        [RuleTile.empty, (5*ROWLENGTH) + 5],
        [RuleTile.stranded, (17*ROWLENGTH) + 3],
        [RuleTile.leftAndRight, (15*ROWLENGTH) + 4],
        [RuleTile.topAndBottom, (15*ROWLENGTH) + 3],
        [RuleTile.allButTop, (16*ROWLENGTH) + 4],
        [RuleTile.allButRight, (16*ROWLENGTH) + 5],
        [RuleTile.allButBottom, (15*ROWLENGTH) + 5],
        [RuleTile.allButLeft, (16*ROWLENGTH) + 3]
    ])

    static sandTileSetNoGaps = new Map<RuleTile, integer>([
        [RuleTile.surrounded, (13*ROWLENGTH) + 7],
        [RuleTile.top, (12*ROWLENGTH) + 7],
        [RuleTile.right, (13*ROWLENGTH) + 8],
        [RuleTile.bottom, (14*ROWLENGTH) + 7],
        [RuleTile.left, (13*ROWLENGTH) + 6],
        [RuleTile.topLeft, (12*ROWLENGTH) + 6],
        [RuleTile.topRight, (12*ROWLENGTH) + 8],
        [RuleTile.bottomRight, (14*ROWLENGTH) + 8],
        [RuleTile.bottomLeft, (14*ROWLENGTH) + 6],
        [RuleTile.empty, (5*ROWLENGTH) + 8],
        [RuleTile.stranded, (17*ROWLENGTH) + 6],
        [RuleTile.leftAndRight, (15*ROWLENGTH) + 7],
        [RuleTile.topAndBottom, (15*ROWLENGTH) + 6],
        [RuleTile.allButTop, (16*ROWLENGTH) + 7],
        [RuleTile.allButRight, (16*ROWLENGTH) + 8],
        [RuleTile.allButBottom, (15*ROWLENGTH) + 8],
        [RuleTile.allButLeft, (16*ROWLENGTH) + 6]
    ])


    static LandTypeToTileSet = new Map<LandTypes, Map<RuleTile, integer>>([
        [LandTypes.Normal, this.landTileSet],
        [LandTypes.Sandy, this.sandTileSetNoGaps],
        [LandTypes.DeadRoot, this.deadRootTileSetNoGaps]
    ])

    static convertToIndexes(landData: LandData) {
        const land_tile_type = this.determineTileType(landData, TileResultOption.land);
        const landTileSet = RuleTileSets.LandTypeToTileSet.get(landData.landType);
        const land_index = landData.isLand() ? landTileSet.get(land_tile_type) : -1;

        const water_tile_type = this.determineTileType(landData, TileResultOption.water);
        const water_index = landData.hasWater() ? RuleTileSets.waterTileSet.get(water_tile_type) : -1;

        const background_type = this.determineTileType(landData, TileResultOption.background);
        const background_index = (landData.landType !== LandTypes.None) ? RuleTileSets.landTileSetNoGaps.get(background_type) : -1

        const mineral_index = (landData.phosphorous) ? (5 * 25) + 9 : -1;

        return({land: land_index, water: water_index, background: background_index, mineral: mineral_index})
    }

    static determineTileType(landData: LandData, option: TileResultOption){

        const {x, y} = landData.pos;
        const mapData = landData.mapData.landGenerator.landData;
        const landType = landData.landType;

        if(option === TileResultOption.land){
            const N = (y === 0) ? false : mapData[y-1][x].landType === landType;
            const E = (x === Game_Config.MAP_SIZE.x - 1) ? false : mapData[y][x+1].landType === landType
            const S = (y === Game_Config.MAP_SIZE.y - 1) ? false : mapData[y+1][x].landType === landType
            const W = (x === 0) ? false : mapData[y][x-1].landType === landType

            const tileType = Direction_to_Ruletile.get(JSON.stringify({N: N, E: E, S: S, W: W}))
            return tileType;
        }

        else if(option === TileResultOption.water){
            const N = (y === 0) ? false : mapData[y-1][x].hasWater();
            const E = (x === Game_Config.MAP_SIZE.x - 1) ? false : mapData[y][x+1].hasWater()
            const S = (y === Game_Config.MAP_SIZE.y - 1) ? false : mapData[y+1][x].hasWater()
            const W = (x === 0) ? false : mapData[y][x-1].hasWater()

            const tileType = Direction_to_Ruletile.get(JSON.stringify({N: N, E: E, S: S, W: W}))
            return tileType;
        }

        else if(option === TileResultOption.background){
            const N = (y === 0) ? false : mapData[y-1][x].landType !== LandTypes.None
            const E = (x === Game_Config.MAP_SIZE.x - 1) ? false : mapData[y][x+1].landType !== LandTypes.None
            const S = (y === Game_Config.MAP_SIZE.y - 1) ? false : mapData[y+1][x].landType !== LandTypes.None
            const W = (x === 0) ? false : mapData[y][x-1].landType !== LandTypes.None

            const tileType = Direction_to_Ruletile.get(JSON.stringify({N: N, E: E, S: S, W: W}))
            return tileType;
        }
    }

}

export enum TileResultOption {
    land,
    water,
    background
}


