

export type LeafFrames = {
    top: number,
    middle: number,
    bottom: number,
}

export type BranchFrames = {
    top: number,
    bottom: number,
}

const ROWLENGTH = 6;


export default class TreeComponents {

    static LeafComponents: LeafFrames[] = [
        {top: (ROWLENGTH * 3) + 3, middle: (ROWLENGTH * 3) + 2, bottom: (ROWLENGTH * 3) + 1},
        {top: (ROWLENGTH * 4) + 3, middle: (ROWLENGTH * 4) + 2, bottom: (ROWLENGTH * 4) + 1},
        {top: (ROWLENGTH * 5) + 3, middle: (ROWLENGTH * 5) + 2, bottom: (ROWLENGTH * 5) + 1},
        {top: (ROWLENGTH * 6) + 3, middle: (ROWLENGTH * 6) + 2, bottom: (ROWLENGTH * 6) + 1},
        {top: (ROWLENGTH * 7) + 3, middle: (ROWLENGTH * 7) + 2, bottom: (ROWLENGTH * 7) + 1}

    ];

    static BranchComponents: BranchFrames[] = [
        {top: (ROWLENGTH * 0) + 1, bottom: (ROWLENGTH * 0) + 2},
        {top: (ROWLENGTH * 1) + 1, bottom: (ROWLENGTH * 3) + 2}
    ]

}