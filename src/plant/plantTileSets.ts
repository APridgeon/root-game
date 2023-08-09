import PlantData, { PlantSize } from "./plantData";

export enum PlantTile {
    AboveGround = 0,
    TipBottom = 1,
    TipTop = 2,
    TipLeft = 3,
    TipRight = 4,
    TopAndBottom = 5,
    LeftAndRight = 6,
    TopAndRight = 7,
    TopAndLeft = 8,
    BottomAndRight = 9,
    BottomAndLeft = 10,
    AllButTop = 11,
    AllButRight = 12,
    AllButBottom = 13,
    AllButLeft = 14,
    Surrounded = 15
}

export default class PlantTileSets {

    static testSet = new Map<PlantTile, integer>([
        [PlantTile.AboveGround, (7*10) + 0],
        [PlantTile.TipBottom, (8*10) + 0],
        [PlantTile.TipTop, (8*10) + 1],
        [PlantTile.TipLeft, (8*10) + 3],
        [PlantTile.TipRight, (8*10) + 2],
        [PlantTile.TopAndBottom, (9*10) + 0],
        [PlantTile.LeftAndRight, (9*10) + 1],
        [PlantTile.TopAndRight, (10*10) + 2],
        [PlantTile.TopAndLeft, (10*10) + 3],
        [PlantTile.BottomAndRight, (9*10) + 2],
        [PlantTile.BottomAndLeft, (9*10) + 3],
        [PlantTile.AllButTop, (11*10) + 1],
        [PlantTile.AllButRight, (10*10) + 1],
        [PlantTile.AllButBottom, (11*10) + 0],
        [PlantTile.AllButLeft, (10*10) + 0],
        [PlantTile.Surrounded, (11*10) + 2]

    ]);


    static ConvertToTileIndex(x: number, y:number, plantData: boolean[][], plantTileSet: Map<PlantTile, integer>){

        let tileIndexValue;

         //tip bottom
        if(plantData[y-1][x] && !plantData[y][x-1] && !plantData[y][x+1] && !plantData[y+1][x]){
            tileIndexValue = plantTileSet.get(PlantTile.TipBottom);
        }
        //tip top
        else if(!plantData[y-1][x] && !plantData[y][x-1] && !plantData[y][x+1] && plantData[y+1][x]){
            tileIndexValue = plantTileSet.get(PlantTile.TipTop);
        }
        //tip left
        else if(!plantData[y-1][x] && plantData[y][x-1] && !plantData[y][x+1] && !plantData[y+1][x]){
            tileIndexValue = plantTileSet.get(PlantTile.TipLeft);
        }
        //tip right
        else if(!plantData[y-1][x] && !plantData[y][x-1] && plantData[y][x+1] && !plantData[y+1][x]){
            tileIndexValue = plantTileSet.get(PlantTile.TipRight);
        }
        //top and bottom
        else if(plantData[y-1][x] && !plantData[y][x-1] && !plantData[y][x+1] && plantData[y+1][x]){
            tileIndexValue = plantTileSet.get(PlantTile.TopAndBottom);
        }
        //left and right
        else if(!plantData[y-1][x] && plantData[y][x-1] && plantData[y][x+1] && !plantData[y+1][x]){
            tileIndexValue = plantTileSet.get(PlantTile.LeftAndRight);
        }
        //top and right
        else if(plantData[y-1][x] && !plantData[y][x-1] && plantData[y][x+1] && !plantData[y+1][x]){
            tileIndexValue = plantTileSet.get(PlantTile.TopAndRight);
        }
        //top and left
        else if(plantData[y-1][x] && plantData[y][x-1] && !plantData[y][x+1] && !plantData[y+1][x]){
            tileIndexValue = plantTileSet.get(PlantTile.TopAndLeft);
        }
        //bottom and left
        else if(!plantData[y-1][x] && plantData[y][x-1] && !plantData[y][x+1] && plantData[y+1][x]){
            tileIndexValue = plantTileSet.get(PlantTile.BottomAndLeft);
        }
        //bottom and right
        else if(!plantData[y-1][x] && !plantData[y][x-1] && plantData[y][x+1] && plantData[y+1][x]){
            tileIndexValue = plantTileSet.get(PlantTile.BottomAndRight);
        }
        //all but top
        else if(!plantData[y-1][x] && plantData[y][x-1] && plantData[y][x+1] && plantData[y+1][x]){
            tileIndexValue = plantTileSet.get(PlantTile.AllButTop);
        }
        //all but right
        else if(plantData[y-1][x] && plantData[y][x-1] && !plantData[y][x+1] && plantData[y+1][x]){
            tileIndexValue = plantTileSet.get(PlantTile.AllButRight);
        }
        //all but bottom
        else if(plantData[y-1][x] && plantData[y][x-1] && plantData[y][x+1] && !plantData[y+1][x]){
            tileIndexValue = plantTileSet.get(PlantTile.AllButBottom);
        }
        //all but left
        else if(plantData[y-1][x] && !plantData[y][x-1] && plantData[y][x+1] && plantData[y+1][x]){
            tileIndexValue = plantTileSet.get(PlantTile.AllButLeft);
        }
        //surrounded
        else if(plantData[y-1][x] && plantData[y][x-1] && plantData[y][x+1] && plantData[y+1][x]){
            tileIndexValue = plantTileSet.get(PlantTile.Surrounded);
        }

        return tileIndexValue;
    }


}