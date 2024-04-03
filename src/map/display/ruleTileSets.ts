import { Game } from "phaser";
import Game_Config from "../../game_config";
import { Position } from "../../plant/plantData";
import { LandTypes } from "../data/landGenerator";
import LandData from "../data/landData";

const ROWLENGTH = 25;

export enum RuleTile {
    surrounded = 0,
    top = 1,
    right = 2,
    bottom = 3,
    left = 4,
    leftAndRight = 5,
    topLeft = 6,
    topRight = 7,
    bottomLeft = 8,
    bottomRight = 9,
    stranded = 10,
    topAndBottom = 11,
    allButLeft = 12,
    allButRight = 13,
    allButTop = 14,
    allButBottom = 15,
    empty = 20
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



    static ConvertToTileIndex_water(x: number, y:number, mapData: LandData[][], ruleTileSet: Map<RuleTile, integer>){

        let tileIndexValue;

        let N;
        let E;
        let S;
        let W;

        if(x === 0){
            W = false;
        } else {
            W = mapData[y][x-1].water > 0;
        }
        if(x === Game_Config.MAP_SIZE.x - 1){
            E = false;
        } else {
            E = mapData[y][x+1].water > 0;
        }
        if(y === 0){
            N = false;
        } else {
            N = mapData[y-1][x].water > 0;
        }
        if(y === Game_Config.MAP_SIZE.y - 1){
            S = false;
        } else {
            S = mapData[y+1][x].water > 0;
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

    static ConvertToTileIndex2(pos: Position, mapData: LandData[][], landType: LandTypes) {
        let ruleTileSet;

        if(landType === LandTypes.DeadRoot){
            ruleTileSet = RuleTileSets.deadRootTileSetNoGaps;
        } else if(landType === LandTypes.Normal){
            ruleTileSet = RuleTileSets.landTileSet;
        } else if(landType === LandTypes.Sandy){
            ruleTileSet = RuleTileSets.sandTileSetNoGaps;
        }

        let tileIndexValue;
        let tileType: RuleTile;

        let N;
        let E;
        let S;
        let W;

        if(pos.x === 0){
            W = false;
        } else {
            W = (mapData[pos.y][pos.x-1].landType === landType);
        }
        if(pos.x === Game_Config.MAP_SIZE.x - 1){
            E = false;
        } else {
            E = (mapData[pos.y][pos.x+1].landType === landType);
        }
        if(pos.y === 0){
            N = false;
        } else {
            N = (mapData[pos.y-1][pos.x].landType === landType);
        }
        if(pos.y === Game_Config.MAP_SIZE.y - 1){
            S = false;
        } else {
            S = (mapData[pos.y+1][pos.x].landType === landType);
        }

        if(N && W && E && S){
            tileType = RuleTile.surrounded;
            tileIndexValue = ruleTileSet.get(RuleTile.surrounded);
                }
            //stranded
            if(!N && !W && !E && !S){
                tileType = RuleTile.stranded;
                tileIndexValue = ruleTileSet.get(RuleTile.stranded);
            }
            //top
            else if(!N && W && E && S){
                tileType = RuleTile.top;
                tileIndexValue = ruleTileSet.get(RuleTile.top);
            }

            //bottom
            else if(N && W && E && !S){
                tileType = RuleTile.bottom;
                tileIndexValue = ruleTileSet.get(RuleTile.bottom);
            }

            //left
            else if(N && !W && E && S){
                tileType = RuleTile.left;
                tileIndexValue = ruleTileSet.get(RuleTile.left);
            }

            //right
            else if(N && W && !E && S){
                tileType = RuleTile.right;
                tileIndexValue = ruleTileSet.get(RuleTile.right);
            }

            //top right
            else if(!N && W && !E && S){
                tileType = RuleTile.topRight;
                tileIndexValue = ruleTileSet.get(RuleTile.topRight);
            }    
            
            //top left
            else if(!N && !W  && E && S){
                tileType = RuleTile.topLeft;
                tileIndexValue = ruleTileSet.get(RuleTile.topLeft);
            } 

            //bottom left
            else if(N && !W  && E && !S ){
                tileType = RuleTile.bottomLeft;
                tileIndexValue = ruleTileSet.get(RuleTile.bottomLeft);
            } 

            //bottom right
            else if(N && W && !E && !S){
                tileType = RuleTile.bottomRight;
                tileIndexValue = ruleTileSet.get(RuleTile.bottomRight);
            } 
            //left and right
            else if(N && !W && !E && S){
                tileType = RuleTile.leftAndRight;
                tileIndexValue = ruleTileSet.get(RuleTile.leftAndRight);
            } 
            //top and bottom
            else if(!N && W && E && !S){
                tileType = RuleTile.topAndBottom;
                tileIndexValue = ruleTileSet.get(RuleTile.topAndBottom);
            } 
            //all but top
            else if(N && !W && !E  && !S){
                tileType = RuleTile.allButTop;
                tileIndexValue = ruleTileSet.get(RuleTile.allButTop);
            } 
            //all but right
            else if(!N  && !W && E && !S){
                tileType = RuleTile.allButRight;
                tileIndexValue = ruleTileSet.get(RuleTile.allButRight);
            } 
            //all but bottom
            else if(!N && !W && !E && S){
                tileType = RuleTile.allButBottom;
                tileIndexValue = ruleTileSet.get(RuleTile.allButBottom);
            } 
            //all but left
            else if(!N  && W && !E && !S){
                tileType = RuleTile.allButLeft;
                tileIndexValue = ruleTileSet.get(RuleTile.allButLeft);
            } 
            //empty
            else if(!N && !W && !E && !S){
                tileType = RuleTile.empty;
                tileIndexValue = RuleTileSets.landTileSet.get(RuleTile.empty);
            }
        
        let result: TileIndexResult = {
            tileIndex: tileIndexValue,
            tileType: tileType
        }
        return result;

    }

}

export type TileIndexResult = {
    tileIndex: integer;
    tileType: RuleTile;
}


