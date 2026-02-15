import { Position } from "../plant/plantData";



export enum Direction {
    North  = 'N',
    East = 'E',
    South = 'S',
    West = 'W',
    None = 'NA'
}

export class DirectionVectors {

    static vectors = new Map<Direction, Position>([
        [Direction.North, {x: 0, y: -1}],
        [Direction.East, {x: 1, y: 0}],
        [Direction.South, {x: 0, y: 1}],
        [Direction.West, {x: -1, y: 0}]

    ])

}

export function subtract_vectors(a: Position, b: Position){
    return {x: a.x - b.x, y: a.y - b.y}
}