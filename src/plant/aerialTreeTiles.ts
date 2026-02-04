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

const ROW_LENGTH = 6;

/**
 * Helper to generate leaf frame indices based on row index.
 * Assumes a layout of [bottom, middle, top] in columns 1, 2, and 3.
 */
const createLeafRow = (row: number): LeafFrames => ({
    bottom: (row * ROW_LENGTH) + 1,
    middle: (row * ROW_LENGTH) + 2,
    top:    (row * ROW_LENGTH) + 3,
});

export default class TreeComponents {
    /** * All available leaf variations defined by their row in the spritesheet.
     */
    static readonly LeafComponents: LeafFrames[] = [
        createLeafRow(3),  // Normal 1
        createLeafRow(4),  // Normal 2
        createLeafRow(5),  // Normal 3
        createLeafRow(6),  // Normal 4
        createLeafRow(7),  // Willow 1
        createLeafRow(8),  // Willow 2
        createLeafRow(9),  // Square 1
        createLeafRow(10), // Square 2
    ];

    /**
     * Maps specific tree species to their allowed leaf variations.
     */
    static readonly treeTypeLeafMap = new Map<TreeType, LeafFrames[]>([
        [TreeType.Normal, TreeComponents.LeafComponents.slice(0, 4)],
        [TreeType.Willow, TreeComponents.LeafComponents.slice(4, 6)],
        [TreeType.Square, TreeComponents.LeafComponents.slice(6, 8)]
    ]);

    static readonly pixelRes = 16;
}