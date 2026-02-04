import PlantData from "./plantData";

const ROWLENGTH = 25;

// Assign bit values to directions
enum Direction {
    N = 1, // 0001
    E = 2, // 0010
    S = 4, // 0100
    W = 8  // 1000
}

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

/**
 * Array index corresponds to the bitmask sum.
 * Example: N (1) + S (4) = 5. Index 5 returns TopAndBottom.
 */
const BITMASK_TO_TILE: PlantTile[] = [];
BITMASK_TO_TILE[0] = PlantTile.AboveGround; 
BITMASK_TO_TILE[Direction.N] = PlantTile.TipBottom;
BITMASK_TO_TILE[Direction.S] = PlantTile.TipTop;
BITMASK_TO_TILE[Direction.W] = PlantTile.TipLeft;
BITMASK_TO_TILE[Direction.E] = PlantTile.TipRight;
BITMASK_TO_TILE[Direction.N | Direction.S] = PlantTile.TopAndBottom;
BITMASK_TO_TILE[Direction.E | Direction.W] = PlantTile.LeftAndRight;
BITMASK_TO_TILE[Direction.N | Direction.E] = PlantTile.TopAndRight;
BITMASK_TO_TILE[Direction.N | Direction.W] = PlantTile.TopAndLeft;
BITMASK_TO_TILE[Direction.S | Direction.E] = PlantTile.BottomAndRight;
BITMASK_TO_TILE[Direction.S | Direction.W] = PlantTile.BottomAndLeft;
BITMASK_TO_TILE[Direction.E | Direction.S | Direction.W] = PlantTile.AllButTop;
BITMASK_TO_TILE[Direction.N | Direction.S | Direction.E] = PlantTile.AllButRight;
BITMASK_TO_TILE[Direction.N | Direction.E | Direction.W] = PlantTile.AllButBottom;
BITMASK_TO_TILE[Direction.N | Direction.W | Direction.S] = PlantTile.AllButLeft;
BITMASK_TO_TILE[Direction.N | Direction.E | Direction.S | Direction.W] = PlantTile.Surrounded;



export default class PlantTileSets {
    static rootSet1 = new Map<PlantTile, number>([
        [PlantTile.AboveGround, (5 * ROWLENGTH) + 2],
        [PlantTile.TipBottom, (18 * ROWLENGTH) + 0],
        [PlantTile.TipTop, (18 * ROWLENGTH) + 1],
        [PlantTile.TipLeft, (18 * ROWLENGTH) + 3],
        [PlantTile.TipRight, (18 * ROWLENGTH) + 2],
        [PlantTile.TopAndBottom, (19 * ROWLENGTH) + 0],
        [PlantTile.LeftAndRight, (19 * ROWLENGTH) + 1],
        [PlantTile.TopAndRight, (20 * ROWLENGTH) + 2],
        [PlantTile.TopAndLeft, (20 * ROWLENGTH) + 3],
        [PlantTile.BottomAndRight, (19 * ROWLENGTH) + 2],
        [PlantTile.BottomAndLeft, (19 * ROWLENGTH) + 3],
        [PlantTile.AllButTop, (21 * ROWLENGTH) + 1],
        [PlantTile.AllButLeft, (20 * ROWLENGTH) + 1],
        [PlantTile.AllButBottom, (21 * ROWLENGTH) + 0],
        [PlantTile.AllButRight, (20 * ROWLENGTH) + 0],
        [PlantTile.Surrounded, (21 * ROWLENGTH) + 2]
    ]);

    static ConvertToTileIndex(x: number, y: number, plantDataSet: PlantData, plantTileSet: Map<PlantTile, number>) {
        // Optimization: Convert rootData to a Set of strings "x,y" once before calling this 
        // if calling in a loop, otherwise .some() is O(n) which is slow.
        const exists = (tx: number, ty: number) => {
            if (plantDataSet.startPos.x === tx && plantDataSet.startPos.y === ty) return true;
            return plantDataSet.rootData.some((p: any) => p.x === tx && p.y === ty);
        };

        let mask = 0;
        // const N = (plantDataSet.startPos.x === x && plantDataSet.startPos.y === y ) ? 
//             true : plantDataSet.rootData.some(val => {return val.x === Npos.x && val.y === Npos.y}); 
        if (plantDataSet.startPos.x === x && plantDataSet.startPos.y === y) {
            mask |= Direction.N;
        } else if (exists(x, y - 1)) mask |= Direction.N;
        if (exists(x + 1, y)) mask |= Direction.E;
        if (exists(x, y + 1)) mask |= Direction.S;
        if (exists(x - 1, y)) mask |= Direction.W;

        const plantTile = BITMASK_TO_TILE[mask];
        return plantTileSet.get(plantTile);
    }
}