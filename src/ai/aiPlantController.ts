import Game_Config from "../game_config";
import { Direction } from "../general/direction";
import PlantData, { Position } from "../plant/plantData";
import { RootData } from "../player/userInput";
import * as Phaser from "phaser";


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

        const root_length = this.plant.rootData.length - 1;
        const chosen_root = this.plant.rootData[Phaser.Math.RND.integerInRange((root_length-5) > 0 ? (root_length-5) : 0, root_length)];
        const chosen_direction = [Direction.East, Direction.South, Direction.South, Direction.South, Direction.West][Phaser.Math.RND.integerInRange(0, 4)];
        const direction_vector = direction_to_pos.get(chosen_direction) as Position;
        let new_position = {x: chosen_root.x + direction_vector.x, y: chosen_root.y + direction_vector.y};
        new_position.x = Phaser.Math.Clamp(new_position.x, 0, Game_Config.MAP_SIZE.x)

        const new_root_data = {coords: new_position, plant: this.plant};
        this.scene.events.emit('rootGrowthRequest', new_root_data);
    }


}