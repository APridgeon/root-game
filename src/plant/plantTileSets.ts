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

export const Direction_to_PlantTile = new Map<string, PlantTile>([
    [JSON.stringify({N: true, E: false, S: false, W: false}), PlantTile.TipBottom],
    [JSON.stringify({N: false, E: false, S: true, W: false}), PlantTile.TipTop],
    [JSON.stringify({N: false, E: true, S: false, W: false}), PlantTile.TipRight],
    [JSON.stringify({N: false, E: false, S: false, W: true}), PlantTile.TipLeft],
    [JSON.stringify({N: true, E: false, S: true, W: false}), PlantTile.TopAndBottom],
    [JSON.stringify({N: false, E: true, S: false, W: true}), PlantTile.LeftAndRight],
    [JSON.stringify({N: true, E: false, S: false, W: true}), PlantTile.TopAndLeft],
    [JSON.stringify({N: true, E: true, S: false, W: false}), PlantTile.TopAndRight],
    [JSON.stringify({N: false, E: false, S: true, W: true}), PlantTile.BottomAndLeft],
    [JSON.stringify({N: false, E: true, S: true, W: false}), PlantTile.BottomAndRight],
    [JSON.stringify({N: false, E: true, S: true, W: true}), PlantTile.AllButTop],
    [JSON.stringify({N: true, E: true, S: true, W: false}), PlantTile.AllButRight],
    [JSON.stringify({N: true, E: true, S: false, W: true}), PlantTile.AllButBottom],
    [JSON.stringify({N: true, E: false, S: true, W: true}), PlantTile.AllButLeft],
    [JSON.stringify({N: true, E: true, S: true, W: true}), PlantTile.Surrounded],
])

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
        [PlantTile.AllButLeft, (20*ROWLENGTH) + 1],
        [PlantTile.AllButBottom, (21*ROWLENGTH) + 0],
        [PlantTile.AllButRight, (20*ROWLENGTH) + 0],
        [PlantTile.Surrounded, (21*ROWLENGTH) + 2]

    ]);


    static ConvertToTileIndex(x: number, y:number, plantDataSet: PlantData, plantTileSet: Map<PlantTile, integer>){

        const Npos = {x: x, y: y - 1};
        const Epos = {x: x + 1, y: y};
        const Spos = {x: x, y: y + 1};
        const Wpos = {x: x - 1, y: y};

        const N = (plantDataSet.startPos.x === x && plantDataSet.startPos.y === y ) ? 
            true : plantDataSet.__rootData.some(val => {return val.x === Npos.x && val.y === Npos.y});    
        const E = plantDataSet.__rootData.some(val => {return val.x === Epos.x && val.y === Epos.y}); 
        const S = plantDataSet.__rootData.some(val => {return val.x === Spos.x && val.y === Spos.y}); 
        const W = plantDataSet.__rootData.some(val => {return val.x === Wpos.x && val.y === Wpos.y});

        const plantTile = Direction_to_PlantTile.get(JSON.stringify({N, E, S, W}))
        const tileIndexValue = plantTileSet.get(plantTile)

        return tileIndexValue;
    }


}