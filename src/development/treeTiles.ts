
export type LeafFrames = {
    top: number,
    middle: number,
    bottom: number,
}

const ROWLENGTH = 6;


export default class TreeComponents {

    static LeafComponents: LeafFrames[] = [
        {top: (ROWLENGTH * 4) + 3, middle: (ROWLENGTH * 4) + 2, bottom: (ROWLENGTH * 4) + 1}
    ];

}