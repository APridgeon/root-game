import { Game } from "phaser";
import Game_Config from "../../game_config";
import { Position } from "../../plant/plantData";
import { LandTypes } from "../data/landGenerator";

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
        [RuleTile.surrounded, (1*ROWLENGTH) + 4],
        [RuleTile.top, (0*ROWLENGTH) + 4],
        [RuleTile.right, (1*ROWLENGTH) + 5],
        [RuleTile.bottom, (2*ROWLENGTH) + 4],
        [RuleTile.left, (1*ROWLENGTH) + 3],
        [RuleTile.topLeft, (0*ROWLENGTH) + 3],
        [RuleTile.topRight, (0*ROWLENGTH) + 5],
        [RuleTile.bottomRight, (2*ROWLENGTH) + 5],
        [RuleTile.bottomLeft, (2*ROWLENGTH) + 3],
        [RuleTile.empty, (5*ROWLENGTH) + 5],
        [RuleTile.stranded, (5*ROWLENGTH) + 3],
        [RuleTile.leftAndRight, (3*ROWLENGTH) + 4],
        [RuleTile.topAndBottom, (3*ROWLENGTH) + 3],
        [RuleTile.allButTop, (4*ROWLENGTH) + 4],
        [RuleTile.allButRight, (4*ROWLENGTH) + 5],
        [RuleTile.allButBottom, (3*ROWLENGTH) + 5],
        [RuleTile.allButLeft, (4*ROWLENGTH) + 3]
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
        [RuleTile.surrounded, (1*ROWLENGTH) + 7],
        [RuleTile.top, (0*ROWLENGTH) + 7],
        [RuleTile.bottom, (2*ROWLENGTH) + 7],
        [RuleTile.left, (1*ROWLENGTH) + 6],
        [RuleTile.right, (1*ROWLENGTH) + 8],
        [RuleTile.topLeft, (0*ROWLENGTH) + 6],
        [RuleTile.topRight, (0*ROWLENGTH) + 8],
        [RuleTile.bottomLeft, (2*ROWLENGTH) + 6],
        [RuleTile.bottomRight, (2*ROWLENGTH) + 8],
        [RuleTile.stranded, (5*ROWLENGTH) + 6],
        [RuleTile.leftAndRight, (3*ROWLENGTH) + 7],
        [RuleTile.topAndBottom, (3*ROWLENGTH) + 6],
        [RuleTile.allButTop, (4*ROWLENGTH) + 7],
        [RuleTile.allButRight, (4*ROWLENGTH) + 8],
        [RuleTile.allButBottom, (3*ROWLENGTH) + 8],
        [RuleTile.allButLeft, (4*ROWLENGTH) + 6],
        [RuleTile.empty, (5*ROWLENGTH) + 7]
    ])

    static sandTileSet = new Map<RuleTile, integer>([
        [RuleTile.surrounded, (7*ROWLENGTH) + 5],
        [RuleTile.top, (6*ROWLENGTH) + 5],
        [RuleTile.bottom, (8*ROWLENGTH) + 5],
        [RuleTile.left, (7*ROWLENGTH) + 4],
        [RuleTile.right, (7*ROWLENGTH) + 6],
        [RuleTile.topLeft, (6*ROWLENGTH) + 4],
        [RuleTile.topRight, (6*ROWLENGTH) + 6],
        [RuleTile.bottomLeft, (8*ROWLENGTH) + 4],
        [RuleTile.bottomRight, (8*ROWLENGTH) + 6],
        [RuleTile.stranded, (11*ROWLENGTH) + 4],
        [RuleTile.leftAndRight, (9*ROWLENGTH) + 5],
        [RuleTile.topAndBottom, (9*ROWLENGTH) + 4],
        [RuleTile.allButTop, (10*ROWLENGTH) + 5],
        [RuleTile.allButRight, (10*ROWLENGTH) + 6],
        [RuleTile.allButBottom, (9*ROWLENGTH) + 6],
        [RuleTile.allButLeft, (10*ROWLENGTH) + 4],
        [RuleTile.empty, (5*ROWLENGTH) + 5]
    ])

    static deadRootTileSet2 = new Map<RuleTile, integer>([
        [RuleTile.surrounded, (7*ROWLENGTH) + 8],
        [RuleTile.top, (6*ROWLENGTH) + 8],
        [RuleTile.bottom, (8*ROWLENGTH) + 8],
        [RuleTile.left, (7*ROWLENGTH) + 7],
        [RuleTile.right, (7*ROWLENGTH) + 9],
        [RuleTile.topLeft, (6*ROWLENGTH) + 7],
        [RuleTile.topRight, (6*ROWLENGTH) + 9],
        [RuleTile.bottomLeft, (8*ROWLENGTH) + 7],
        [RuleTile.bottomRight, (8*ROWLENGTH) + 9],
        [RuleTile.stranded, (11*ROWLENGTH) + 7],
        [RuleTile.leftAndRight, (9*ROWLENGTH) + 8],
        [RuleTile.topAndBottom, (9*ROWLENGTH) + 7],
        [RuleTile.allButTop, (10*ROWLENGTH) + 8],
        [RuleTile.allButRight, (10*ROWLENGTH) + 9],
        [RuleTile.allButBottom, (9*ROWLENGTH) + 9],
        [RuleTile.allButLeft, (10*ROWLENGTH) + 7],
        [RuleTile.empty, (5*ROWLENGTH) + 8]
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

    static ConvertToTileIndex2(pos: Position, mapData: LandTypes[][], landType: LandTypes, ruleTileSet: Map<RuleTile, integer>) {


        let tileIndexValue;

        let N;
        let E;
        let S;
        let W;

        if(pos.x === 0){
            W = false;
        } else {
            W = (mapData[pos.y][pos.x-1] === landType);
        }
        if(pos.x === Game_Config.MAP_SIZE.x - 1){
            E = false;
        } else {
            E = (mapData[pos.y][pos.x+1] === landType);
        }
        if(pos.y === 0){
            N = false;
        } else {
            N = (mapData[pos.y-1][pos.x] === landType);
        }
        if(pos.y === Game_Config.MAP_SIZE.y - 1){
            S = false;
        } else {
            S = (mapData[pos.y+1][pos.x] === landType);
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

}


