import Main from "../game";
import Game_Config from "../game_config";
import { Direction, subtract_vectors } from "../general/direction";
import PlantData, { Position } from "../plant/plantData";
import { RootData } from "../player/userInput";
import * as Phaser from "phaser";


const DEBUG = false;

export const direction_to_pos = new Map<Direction, Position>([
    [Direction.North,   {x: 0, y: -1}],
    [Direction.East,    {x: 1, y: 0}],
    [Direction.South,   {x: 0, y: 1}],
    [Direction.West,    {x: -1, y: 0}],
    [Direction.None,    {x: 0, y: 0}]
])

export default class aiController {

    scene: Phaser.Scene;
    plant: PlantData;

    constructor(scene: Phaser.Scene, plant: PlantData){
        this.plant = plant;
        this.scene = scene;
    }

    public aiRootChoice(){
        const position_of_closest_water = this.identify_closest_body_of_water();
        if (DEBUG) console.log(`position of closest water: ${JSON.stringify(position_of_closest_water)} for ${JSON.stringify(this.plant.startPos)}`)

        if(position_of_closest_water){
            const closest_root = this.identify_closest_root(position_of_closest_water, this.plant.rootData);
            if (DEBUG) console.log(`closest root: ${JSON.stringify(closest_root)} for ${JSON.stringify(this.plant.startPos)}`)
            const direction = this.identify_direction(closest_root, position_of_closest_water)
            const direction_vector = direction_to_pos.get(direction) as Position;
            if (DEBUG) console.log(`direction vector: ${JSON.stringify(direction_vector)} for ${JSON.stringify(this.plant.startPos)}`)
            const coords = {
                x: Phaser.Math.Clamp(closest_root.x + direction_vector.x, 0, Game_Config.MAP_SIZE.x - 1),
                y: Phaser.Math.Clamp(closest_root.y + direction_vector.y, 0, Game_Config.MAP_SIZE.y - 1)
            };
            if (DEBUG)console.log(`coords: ${JSON.stringify(coords)} for ${JSON.stringify(this.plant.startPos)}`)
            if ((this.scene as Main).mapManager.isLandTileAccessible(coords)) {
                const new_root_data = { coords, plant: this.plant };
                this.scene.events.emit('rootGrowthRequest', new_root_data);
                if (DEBUG) console.log(`root growth: ${JSON.stringify(new_root_data.coords)} for ${JSON.stringify(this.plant.startPos)}`)
                return
            }
            else {
                if (DEBUG) console.log(`No root growth for ${JSON.stringify(this.plant.startPos)}`)
                const tile = (this.scene as Main).mapManager.mapData.landGenerator.landData[coords.y][coords.x]
                if (DEBUG) console.error(tile)
                if (DEBUG) console.error(`problem tile: ${(tile)} for ${JSON.stringify(this.plant.startPos)}`)

                const new_position = this.randomly_choose_new_root_position();
                const new_root_data = {coords: new_position, plant: this.plant};
                this.scene.events.emit('rootGrowthRequest', new_root_data);
                if (DEBUG) console.log(`random root growth: ${JSON.stringify(new_root_data.coords)} for ${JSON.stringify(this.plant.startPos)}`)
            }
        }
        else {
            const new_position = this.randomly_choose_new_root_position();
            const new_root_data = {coords: new_position, plant: this.plant};
            this.scene.events.emit('rootGrowthRequest', new_root_data);
            if (DEBUG) console.log(`random root growth: ${JSON.stringify(new_root_data.coords)} for ${JSON.stringify(this.plant.startPos)}`)
        }
        
    }

    private r

   
    private identify_closest_body_of_water(): Position | null {
        const pre_queue: Position[] = [...this.plant.rootData];
        const queue = Phaser.Utils.Array.Shuffle(pre_queue)
        const visited = new Set(queue.map(p => `${p.x},${p.y}`));
        const landData = (this.scene as any).mapManager.mapData.landGenerator.landData;
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

    private randomly_choose_new_root_position(){
        const root_length = this.plant.rootData.length - 1;
        const chosen_root = this.plant.rootData[Phaser.Math.RND.integerInRange((root_length-5) > 0 ? (root_length-5) : 0, root_length)];
        const chosen_direction = [Direction.East, Direction.South, Direction.South, Direction.South, Direction.West][Phaser.Math.RND.integerInRange(0, 4)];
        const direction_vector = direction_to_pos.get(chosen_direction) as Position;
        let new_position = {x: chosen_root.x + direction_vector.x, y: chosen_root.y + direction_vector.y};
        new_position.x = Phaser.Math.Clamp(new_position.x, 0, Game_Config.MAP_SIZE.x)

        return new_position
    }

    private identify_closest_root(target_position: Position, root_data: Position[]): Position {
        const distances: number[] = []
        root_data.forEach(root => {
            const subtr = subtract_vectors(target_position, root)
            const absol = {x: Math.abs(subtr.x), y: Math.abs(subtr.y)}
            const distance = absol.x + absol.y
            distances.push(distance)
        })
        const index = distances.findIndex(d => d === Math.min(...distances))
        return root_data[index]
    }

    private identify_direction(closest_root: Position, closest_water: Position): Direction {
        const direction_vector = subtract_vectors(closest_water, closest_root)
        const N_or_S = direction_vector.y
        const E_or_W = direction_vector.x
        if(Math.abs(N_or_S) > Math.abs(E_or_W)){
            if(N_or_S > 0) return Direction.South
            else return Direction.North
        } else {
            if(E_or_W > 0) return Direction.East
            else return Direction.West
        }
    }

    


}    