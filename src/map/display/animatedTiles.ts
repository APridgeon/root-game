export enum AnimatedTile {
    Worm = 0,
    TileDestroy = 1
}



export default class AnimatedTiles {

    static animatedTileSets = new Map<AnimatedTile, integer[]>([
        [
            AnimatedTile.Worm, 
            [
                (13*10) + 0,
                (13*10) + 1,
                (13*10) + 2,
                (13*10) + 3 
            ]
        ],
        [
            AnimatedTile.TileDestroy,
            [
                (14*10) + 0,
                (14*10) + 1,
                (14*10) + 2,
                (14*10) + 3,
                (14*10) + 4

            ]
        ]
    ])
}