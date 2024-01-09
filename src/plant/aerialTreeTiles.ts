export enum TreeType {
    Normal,
    Willow,
    Square
}

export type LeafFrames = {
    top: number,
    middle: number,
    bottom: number,
}

const ROWLENGTH = 6;


export default class TreeComponents {

    static LeafComponents: LeafFrames[] = [
        {top: (ROWLENGTH * 3) + 3, middle: (ROWLENGTH * 3) + 2, bottom: (ROWLENGTH * 3) + 1},
        {top: (ROWLENGTH * 4) + 3, middle: (ROWLENGTH * 4) + 2, bottom: (ROWLENGTH * 4) + 1},
        {top: (ROWLENGTH * 5) + 3, middle: (ROWLENGTH * 5) + 2, bottom: (ROWLENGTH * 5) + 1},
        {top: (ROWLENGTH * 6) + 3, middle: (ROWLENGTH * 6) + 2, bottom: (ROWLENGTH * 6) + 1},
        {top: (ROWLENGTH * 7) + 3, middle: (ROWLENGTH * 7) + 2, bottom: (ROWLENGTH * 7) + 1},
        {top: (ROWLENGTH * 8) + 3, middle: (ROWLENGTH * 8) + 2, bottom: (ROWLENGTH * 8) + 1},
        {top: (ROWLENGTH * 9) + 3, middle: (ROWLENGTH * 9) + 2, bottom: (ROWLENGTH * 9) + 1},
        {top: (ROWLENGTH * 10) + 3, middle: (ROWLENGTH * 10) + 2, bottom: (ROWLENGTH * 10) + 1}

    ];

    static treeTypeLeafMap: Map<TreeType, LeafFrames[]> = new Map([
        [TreeType.Normal, [this.LeafComponents[0], this.LeafComponents[1], this.LeafComponents[2], this.LeafComponents[3]]],
        [TreeType.Willow, [this.LeafComponents[4], this.LeafComponents[5]]],
        [TreeType.Square, [this.LeafComponents[6], this.LeafComponents[7]]]
    ])

    static pixelRes = 16;

}