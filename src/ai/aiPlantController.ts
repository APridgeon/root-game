import * as Phaser from "phaser";
import Main from "../game";
import Game_Config from "../game_config";
import { Direction, DirectionVectors, subtract_vectors } from "../general/direction";
import PlantData, { Position } from "../plant/plantData";
import { Events } from "../events/events";

const DEBUG = true;

/**
 * Mapping of {@link Direction} enum values to their relative coordinate offsets.
 * @internal
 */
export const direction_to_pos = new Map<Direction, Position>([
    [Direction.North,   {x: 0, y: -1}],
    [Direction.East,    {x: 1, y: 0}],
    [Direction.South,   {x: 0, y: 1}],
    [Direction.West,    {x: -1, y: 0}],
    [Direction.None,    {x: 0, y: 0}]
])

/**
 * Controller responsible for AI plant behavior.
 * It handles pathfinding towards water sources and manages procedural growth decisions.
 */
export default class aiController {
    /** Reference to the main game scene cast to the specific Main type. */
    private _mainScene: Main;
    /** The Phaser scene context. */
    scene: Phaser.Scene;
    /** The data model of the plant being controlled. */
    plant: PlantData;

    /**
     * @param scene The active Phaser scene.
     * @param plant The plant data instance this controller will manage.
     */
    constructor(scene: Phaser.Scene, plant: PlantData){
        this.plant = plant;
        this.scene = scene;
    }
    
    /**
     * Helper getter to access the scene with full game-specific typing.
     */
    private get mainScene(): Main {
        return this.scene as Main;
    }

    /**
     * Evaluates the environment and selects the optimal tile for the next root growth.
     * If water is found, it moves towards it; otherwise, it grows in a random downward direction.
     * @public
     */
    public aiRootChoice(): void {
        const position_of_closest_water = this.identify_closest_body_of_water();
        
        if (DEBUG) {
            console.log(`position of closest water: ${JSON.stringify(position_of_closest_water)} for ${JSON.stringify(this.plant.startPos)}`);
        }

        if (position_of_closest_water) {
            const closest_root = this.identify_closest_root(position_of_closest_water, this.plant.rootData);
            const direction = this.identify_direction(closest_root, position_of_closest_water);
            const direction_vector = DirectionVectors.vectors.get(direction) || { x: 0, y: 0 };
            
            const coords: Position = {
                x: Phaser.Math.Clamp(closest_root.x + direction_vector.x, 0, Game_Config.MAP_SIZE.x - 1),
                y: Phaser.Math.Clamp(closest_root.y + direction_vector.y, 0, Game_Config.MAP_SIZE.y - 1)
            };

            if (this.mainScene.mapManager.isLandTileAccessible(coords)) {
                this.requestGrowth(coords);
                return;
            } else {
                if (DEBUG) {
                    const tile = this.mainScene.mapManager.mapData.landGenerator.landData[coords.y][coords.x];
                    console.warn(`Target tile blocked: ${JSON.stringify(coords)}`, tile);
                }
                this.requestGrowth(this.randomly_choose_new_root_position());
            }
        } else {
            let coords = this.randomly_choose_new_root_position()
            let attempts = 0
            while (!this.mainScene.mapManager.isLandTileAccessible(coords) && attempts < 10) {
                coords = this.randomly_choose_new_root_position()
                attempts++
            }
            this.requestGrowth(coords);
        }
    }

    /**
     * Emits a growth request event to be processed by the {@link PlantManager}.
     * @param coords The target grid coordinates for the new root.
     */
    private requestGrowth(coords: Position): void {
        if (DEBUG) console.log(`AI Growth Request: ${JSON.stringify(coords)} for plant at ${JSON.stringify(this.plant.startPos)}`);
        this.scene.events.emit(Events.RootGrowthRequest, { coords, plant: this.plant });
    }

    /**
     * Performs a Breadth-First Search (BFS) starting from existing roots to find 
     * the nearest tile containing water.
     * @returns The coordinates of the closest water source, or null if none found within search limits.
     * @internal
     */
    private identify_closest_body_of_water(): Position | null {
        const pre_queue: Position[] = [...this.plant.rootData];
        const queue = Phaser.Utils.Array.Shuffle(pre_queue);
        const visited = new Set(queue.map(p => `${p.x},${p.y}`));
        const landData = this.mainScene.mapManager.mapData.landGenerator.landData;
        const maxSearch = 1000; // Limit search depth for performance
        let iterations = 0;

        while (queue.length > 0 && iterations < maxSearch) {
            const current = queue.shift()!;
            iterations++;

            const neighbors = [
                { x: current.x, y: current.y - 1 },
                { x: current.x + 1, y: current.y },
                { x: current.x, y: current.y + 1 },
                { x: current.x - 1, y: current.y }
            ];

            for (const neighbor of neighbors) {
                if (neighbor.x < 0 || neighbor.x >= Game_Config.MAP_SIZE.x || neighbor.y < 0 || neighbor.y >= Game_Config.MAP_SIZE.y) continue;
                
                const key = `${neighbor.x},${neighbor.y}`;
                if (visited.has(key)) continue;
                visited.add(key);

                const tile = landData[neighbor.y][neighbor.x];
                if (tile && tile.water > 0) {
                    return neighbor;
                }
                queue.push(neighbor);
            }
        }
        return null;
    }

    /**
     * Selects a random growth direction, weighted heavily towards downward (South) expansion.
     * @returns A new coordinate adjacent to a recent root.
     * @internal
     */
    private randomly_choose_new_root_position(): Position {
        const root_length = this.plant.rootData.length - 1;
        const minIdx = Math.max(0, root_length - 5);
        const chosen_root = this.plant.rootData[Phaser.Math.RND.integerInRange(minIdx, root_length)];
        const chosen_direction = [Direction.East, Direction.South, Direction.South, Direction.South, Direction.West][Phaser.Math.RND.integerInRange(0, 4)];
        const direction_vector = DirectionVectors.vectors.get(chosen_direction) || { x: 0, y: 0 };
        
        return {
            x: Phaser.Math.Clamp(chosen_root.x + direction_vector.x, 0, Game_Config.MAP_SIZE.x - 1),
            y: Phaser.Math.Clamp(chosen_root.y + direction_vector.y, 0, Game_Config.MAP_SIZE.y - 1)
        };
    }

    /**
     * Finds which existing root segment is physically closest to a target coordinate.
     * @param target_position The destination coordinate (e.g., water).
     * @param root_data The array of existing root positions.
     * @returns The position of the closest root segment.
     */
    private identify_closest_root(target_position: Position, root_data: Position[]): Position {
        let closest = root_data[0];
        let minDist = Infinity;

        for (const root of root_data) {
            const dist = Math.abs(target_position.x - root.x) + Math.abs(target_position.y - root.y);
            if (dist < minDist) {
                minDist = dist;
                closest = root;
            }
        }
        return closest;
    }

    /**
     * Determines the cardinal direction required to move from a root toward a target.
     * @param closest_root The starting root position.
     * @param closest_water The target position.
     * @returns The {@link Direction} to grow in.
     */
    private identify_direction(closest_root: Position, closest_water: Position): Direction {
        const dx = closest_water.x - closest_root.x;
        const dy = closest_water.y - closest_root.y;

        if (Math.abs(dy) > Math.abs(dx)) return dy > 0 ? Direction.South : Direction.North;
        return dx > 0 ? Direction.East : Direction.West;
    }
}