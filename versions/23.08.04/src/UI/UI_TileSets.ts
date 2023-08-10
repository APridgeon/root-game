
export enum BoxTiles {
    top = 0,
    right = 1,
    bottom = 2,
    left = 3,
    topRight = 4,
    bottomRight = 5,
    bottomLeft = 6,
    topLeft = 7,
    surrounded = 8
}

export enum BarometerTiles {
    topLeft = 0,
    bottomLeft = 1,
    topMiddle = 2,
    bottomMiddle = 3,
    topRight = 4,
    bottomRight = 5,
    topWater = 6,
    bottomWater = 7
}



export default class UI_TileSets {

    static boxStyle1 = new Map<BoxTiles, integer>([
        [BoxTiles.top, (0*25) + 1],
        [BoxTiles.right, (1*25) + 2],
        [BoxTiles.bottom, (2*25) + 1],
        [BoxTiles.left, (1*25) + 0],
        [BoxTiles.topRight, (0*25) + 2],
        [BoxTiles.bottomRight, (2*25) + 2],
        [BoxTiles.bottomLeft, (2*25) + 0],
        [BoxTiles.topLeft, (0*25) + 0],
        [BoxTiles.surrounded, (1*25) + 1]

    ])
    static boxStyle2 = new Map<BoxTiles, integer>([
        [BoxTiles.top, (0*25) + 1 + 3],
        [BoxTiles.right, (1*25) + 2 + 3],
        [BoxTiles.bottom, (2*25) + 1 + 3],
        [BoxTiles.left, (1*25) + 0 + 3],
        [BoxTiles.topRight, (0*25) + 2 + 3],
        [BoxTiles.bottomRight, (2*25) + 2 + 3],
        [BoxTiles.bottomLeft, (2*25) + 0 + 3],
        [BoxTiles.topLeft, (0*25) + 0 + 3],
        [BoxTiles.surrounded, (1*25) + 1 + 3]

    ])
    static boxStyle3 = new Map<BoxTiles, integer>([
        [BoxTiles.top, (4*25) + 1],
        [BoxTiles.right, (5*25) + 2],
        [BoxTiles.bottom, (6*25) + 1],
        [BoxTiles.left, (5*25) + 0],
        [BoxTiles.topRight, (4*25) + 2],
        [BoxTiles.bottomRight, (6*25) + 2],
        [BoxTiles.bottomLeft, (6*25) + 0],
        [BoxTiles.topLeft, (4*25) + 0],
        [BoxTiles.surrounded, (1*25) + 13]

    ])

    static barometerStyle1 = new Map<BarometerTiles, integer>([
        [BarometerTiles.bottomLeft, (12*25) + 0],
        [BarometerTiles.topLeft, (11*25)],
        [BarometerTiles.bottomMiddle, (12*25) + 1],
        [BarometerTiles.topMiddle, (11*25) + 1],
        [BarometerTiles.bottomRight, (12*25) + 2],
        [BarometerTiles.topRight, (11*25) + 2],
        [BarometerTiles.topWater, (11*25) + 9],
        [BarometerTiles.bottomWater, (12*25) + 9]
    ])
}