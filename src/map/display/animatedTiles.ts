export enum AnimatedTile {
    Worm = 0,
    TileDestroy = 1,
    Mushroom = 2
}


const ROWLENGTH = 25;


export default class AnimatedTiles {

    static animatedTileSets = new Map<AnimatedTile, integer[]>([
        [
            AnimatedTile.Worm, 
            [
                (22*ROWLENGTH) + 0,
                (22*ROWLENGTH) + 1,
                (22*ROWLENGTH) + 2,
                (22*ROWLENGTH) + 3 
            ]
        ],
        [
            AnimatedTile.TileDestroy,
            [
                (23*ROWLENGTH) + 0,
                (23*ROWLENGTH) + 1,
                (23*ROWLENGTH) + 2,
                (23*ROWLENGTH) + 3,
                (23*ROWLENGTH) + 4

            ]
        ],
        [
            AnimatedTile.Mushroom, 
            [
                (22*ROWLENGTH + 4),
                // (22*ROWLENGTH + 5) 
            ]
        ]
    ])
}