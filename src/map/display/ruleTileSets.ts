import { Game } from "phaser";
import Game_Config from "../../game_config";
import { Position } from "../../plant/plantData";
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

    static ConvertToTileIndex(x: number, y:number, mapData: boolean[][], ruleTileSet: Map<RuleTile, integer>){

        let tileIndexValue;

        let N;
        let E;
        let S;
        let W;

        if(x === 0){
            W = false;
        } else {
            W = mapData[y][x-1];
        }
        if(x === Game_Config.MAP_SIZE.x - 1){
            E = false;
        } else {
            E = mapData[y][x+1];
        }
        if(y === 0){
            N = false;
        } else {
            N = mapData[y-1][x];
        }
        if(y === Game_Config.MAP_SIZE.y - 1){
            S = false;
        } else {
            S = mapData[y+1][x];
        }
        

        if(N && W && E && S){
            tileIndexValue = ruleTileSet.get(RuleTile.surrounded);
                }
            //stranded
            if(!N && !W && !E && !S){
                tileIndexValue = ruleTileSet.get(RuleTile.stranded);
            }
            //top
            else if(!N && W && E && S){
                tileIndexValue = ruleTileSet.get(RuleTile.top);
            }

            //bottom
            else if(N && W && E && !S){
                tileIndexValue = ruleTileSet.get(RuleTile.bottom);
            }

            //left
            else if(N && !W && E && S){
                tileIndexValue = ruleTileSet.get(RuleTile.left);
            }

            //right
            else if(N && W && !E && S){
                tileIndexValue = ruleTileSet.get(RuleTile.right);
            }

            //top right
            else if(!N && W && !E && S){
                tileIndexValue = ruleTileSet.get(RuleTile.topRight);
            }    
            
            //top left
            else if(!N && !W  && E && S){
                tileIndexValue = ruleTileSet.get(RuleTile.topLeft);
            } 

            //bottom left
            else if(N && !W  && E && !S ){
                tileIndexValue = ruleTileSet.get(RuleTile.bottomLeft);
            } 

            //bottom right
            else if(N && W && !E && !S){
                tileIndexValue = ruleTileSet.get(RuleTile.bottomRight);
            } 
            //left and right
            else if(N && !W && !E && S){
                tileIndexValue = ruleTileSet.get(RuleTile.leftAndRight);
            } 
            //top and bottom
            else if(!N && W && E && !S){
                tileIndexValue = ruleTileSet.get(RuleTile.topAndBottom);
            } 
            //all but top
            else if(N && !W && !E  && !S){
                tileIndexValue = ruleTileSet.get(RuleTile.allButTop);
            } 
            //all but right
            else if(!N  && !W && E && !S){
                tileIndexValue = ruleTileSet.get(RuleTile.allButRight);
            } 
            //all but bottom
            else if(!N && !W && !E && S){
                tileIndexValue = ruleTileSet.get(RuleTile.allButBottom);
            } 
            //all but left
            else if(!N  && W && !E && !S){
                tileIndexValue = ruleTileSet.get(RuleTile.allButLeft);
            } 
        

        return tileIndexValue;
    }


    static convertToIndexes(landData: LandData): RuleTileResult {

        let ruleTileLand;
        let landIndex;
        let ruleTileWater;
        let waterIndex;

        if(landData.isLand()){
            ruleTileLand = this.determineTileType(landData, TileResultOption.land);
            let landTileSet = RuleTileSets.LandTypeToTileSet.get(landData.landType);
            landIndex = landTileSet.get(ruleTileLand);
    
            ruleTileWater = this.determineTileType(landData, TileResultOption.water);
            waterIndex = RuleTileSets.waterTileSet.get(ruleTileWater);
        } else {
            ruleTileLand = RuleTile.empty
            landIndex = -1
            ruleTileWater = RuleTile.empty
            waterIndex = -1
        }


        let result: RuleTileResult = {
            land: {tileIndex: landIndex, tileType: ruleTileLand},
            water: {tileIndex: waterIndex, tileType: ruleTileWater}

        }

        return result;
    }

    static determineTileType(landData: LandData, option: TileResultOption){

        let N = false;
        let E = false;
        let S = false;
        let W = false;

        let mapData = landData._mapData.landGenerator.landData;
        let landType = landData.landType;

        if(option === TileResultOption.land){
            if(landData.pos.x === 0){
                W = false;
            } else {
                W = (mapData[landData.pos.y][landData.pos.x-1].landType === landType);
            }
            if(landData.pos.x === Game_Config.MAP_SIZE.x - 1){
                E = false;
            } else {
                E = (mapData[landData.pos.y][landData.pos.x+1].landType === landType);
            }
            if(landData.pos.y === 0){
                N = false;
            } else {
                N = (mapData[landData.pos.y-1][landData.pos.x].landType === landType);
            }
            if(landData.pos.y === Game_Config.MAP_SIZE.y - 1){
                S = false;
            } else {
                S = (mapData[landData.pos.y+1][landData.pos.x].landType === landType);
            }

            // console.log(`new: N: ${N}, E: ${E}, S: ${S}, W: ${W}`);
        } 
        else if(option === TileResultOption.water){
            if(landData.pos.x === 0){
                W = false;
            } else {
                W = (mapData[landData.pos.y][landData.pos.x-1].hasWater());
            }
            if(landData.pos.x === Game_Config.MAP_SIZE.x - 1){
                E = false;
            } else {
                E = (mapData[landData.pos.y][landData.pos.x+1].hasWater());
            }
            if(landData.pos.y === 0){
                N = false;
            } else {
                N = (mapData[landData.pos.y-1][landData.pos.x].hasWater());
            }
            if(landData.pos.y === Game_Config.MAP_SIZE.y - 1){
                S = false;
            } else {
                S = (mapData[landData.pos.y+1][landData.pos.x].hasWater());
            }
        }

        let tileType: RuleTile;

        if(N && W && E && S){
            tileType = RuleTile.surrounded;          
                }
            //stranded
            if(!N && !W && !E && !S){
                tileType = RuleTile.stranded;              
            }
            //top
            else if(!N && W && E && S){
                tileType = RuleTile.top;              
            }

            //bottom
            else if(N && W && E && !S){
                tileType = RuleTile.bottom;              
            }

            //left
            else if(N && !W && E && S){
                tileType = RuleTile.left;              
            }

            //right
            else if(N && W && !E && S){
                tileType = RuleTile.right;              
            }

            //top right
            else if(!N && W && !E && S){
                tileType = RuleTile.topRight;              
            }    
            
            //top left
            else if(!N && !W  && E && S){
                tileType = RuleTile.topLeft;              
            } 

            //bottom left
            else if(N && !W  && E && !S ){
                tileType = RuleTile.bottomLeft;              
            } 

            //bottom right
            else if(N && W && !E && !S){
                tileType = RuleTile.bottomRight;              
            } 
            //left and right
            else if(N && !W && !E && S){
                tileType = RuleTile.leftAndRight;              
            } 
            //top and bottom
            else if(!N && W && E && !S){
                tileType = RuleTile.topAndBottom;              
            } 
            //all but top
            else if(N && !W && !E  && !S){
                tileType = RuleTile.allButTop;              
            } 
            //all but right
            else if(!N  && !W && E && !S){
                tileType = RuleTile.allButRight;              
            } 
            //all but bottom
            else if(!N && !W && !E && S){
                tileType = RuleTile.allButBottom;              
            } 
            //all but left
            else if(!N  && W && !E && !S){
                tileType = RuleTile.allButLeft;              
            } 
            //empty
            else if(!N && !W && !E && !S){
                tileType = RuleTile.empty;              
            }

        return tileType;
    }

}




export type TileIndexResult = {
    tileIndex: integer;
    tileType: RuleTile;
}

export type RuleTileResult = {
    land: TileIndexResult,
    water: TileIndexResult
}

export enum TileResultOption {
    land,
    water
}


