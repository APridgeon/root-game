const ROWLENGTH = 25;


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

    static rootSet1 = new Map<PlantTile, integer>([
        [PlantTile.AboveGround, (5*ROWLENGTH) + 2],
        [PlantTile.TipBottom, (18*ROWLENGTH) + 0],
        [PlantTile.TipTop, (18*ROWLENGTH) + 1],
        [PlantTile.TipLeft, (18*ROWLENGTH) + 3],
        [PlantTile.TipRight, (18*ROWLENGTH) + 2],
        [PlantTile.TopAndBottom, (19*ROWLENGTH) + 0],
        [PlantTile.LeftAndRight, (19*ROWLENGTH) + 1],
        [PlantTile.TopAndRight, (20*ROWLENGTH) + 2],
        [PlantTile.TopAndLeft, (20*ROWLENGTH) + 3],
        [PlantTile.BottomAndRight, (19*ROWLENGTH) + 2],
        [PlantTile.BottomAndLeft, (19*ROWLENGTH) + 3],
        [PlantTile.AllButTop, (21*ROWLENGTH) + 1],
        [PlantTile.AllButRight, (20*ROWLENGTH) + 1],
        [PlantTile.AllButBottom, (21*ROWLENGTH) + 0],
        [PlantTile.AllButLeft, (20*ROWLENGTH) + 0],
        [PlantTile.Surrounded, (21*ROWLENGTH) + 2]

    ]);


    static ConvertToTileIndex(x: number, y:number, plantDataSet: PlantData, plantTileSet: Map<PlantTile, integer>){

        let Npos = {x: x, y: y - 1};
        let Epos = {x: x + 1, y: y};
        let Spos = {x: x, y: y + 1};
        let Wpos = {x: x - 1, y: y};

        let N = plantDataSet.__rootData.some(val => {
            return ((val.x === Npos.x) && ((val.y) === (Npos.y))) ? true : false;
        });    
        let E = plantDataSet.__rootData.some(val => {
            return ((val.x === Epos.x) && ((val.y) === (Epos.y))) ? true : false;
        }); 
        let S = plantDataSet.__rootData.some(val => {
            return ((val.x === Spos.x) && ((val.y) === (Spos.y))) ? true : false;
        }); 
        let W = plantDataSet.__rootData.some(val => {
            return ((val.x === Wpos.x) && ((val.y) === (Wpos.y))) ? true : false;
        });

        let tileIndexValue;

        // starting tile
        if(plantDataSet.startPos.x === x && plantDataSet.startPos.y === y ){
            N = true;
        }

         //tip bottom 
        if(N && !W && !E && !S){
            tileIndexValue = plantTileSet.get(PlantTile.TipBottom);
        }
        //tip top
        else if(!N && !W && !E && S){
            tileIndexValue = plantTileSet.get(PlantTile.TipTop);
        }
        //tip left
        else if(!N && W && !E && !S){
            tileIndexValue = plantTileSet.get(PlantTile.TipLeft);
        }
        //tip right
        else if(!N && !W && E && !S){
            tileIndexValue = plantTileSet.get(PlantTile.TipRight);
        }
        //top and bottom
        else if(N && !W && !E && S){
            tileIndexValue = plantTileSet.get(PlantTile.TopAndBottom);
        }
        //left and right
        else if(!N && W && E && !S){
            tileIndexValue = plantTileSet.get(PlantTile.LeftAndRight);
        }
        //top and right
        else if(N && !W && E && !S){
            tileIndexValue = plantTileSet.get(PlantTile.TopAndRight);
        }
        //top and left
        else if(N && W && !E && !S){
            tileIndexValue = plantTileSet.get(PlantTile.TopAndLeft);
        }
        //bottom and left
        else if(!N && W && !E && S){
            tileIndexValue = plantTileSet.get(PlantTile.BottomAndLeft);
        }
        //bottom and right
        else if(!N && !W && E && S){
            tileIndexValue = plantTileSet.get(PlantTile.BottomAndRight);
        }
        //all but top
        else if(!N && W && E && S){
            tileIndexValue = plantTileSet.get(PlantTile.AllButTop);
        }
        //all but right
        else if(N && W && !E && S){
            tileIndexValue = plantTileSet.get(PlantTile.AllButRight);
        }
        //all but bottom
        else if(N && W && E && !S){
            tileIndexValue = plantTileSet.get(PlantTile.AllButBottom);
        }
        //all but left
        else if(N && !W && E && S){
            tileIndexValue = plantTileSet.get(PlantTile.AllButLeft);
        }
        //surrounded
        else if(N && W && E && S){
            tileIndexValue = plantTileSet.get(PlantTile.Surrounded);
        }

        // console.log(N, E, S, W);
        // console.log(`Tile index: ${tileIndexValue}`);

        return tileIndexValue;
    }


}