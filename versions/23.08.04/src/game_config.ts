
export default class Game_Config {

    static GAMEWIDTH: integer = 800;
    static GAMEHEIGHT: integer = 600;
    static PIXEL_RES: integer = 8;

    static MAP_SIZE: integer = 100;
    static MAP_RES: integer = 8;
    static MAP_SCALE: integer = 2;

    static PLANT_STARTING_POSX: integer = 37;

    static WATER_START_LEVEL: integer = 50;
    static WATER_ADD_AMOUNT: integer = 10;
    static WATER_SUBTRACT_AMOUNT: integer = 0.5;

    static MAP_GROUND_LEVEL: integer = 18;
    static MAP_RESOURCE_LEVEL: integer = 19;
    static MAP_UGROUND_HOLE_LEVEL: integer = 20;

    static FONT_RES: integer = 7;
    static FONT_SCALE: integer = 2;

    static UI_RES: integer = 8;
    static UI_SCALE: integer = 2;

    static DAY_SEGMENT_LENGTH = 10 * 1000;

    static MAP_tilesToWorld(tile: integer): integer {
        return tile*this.MAP_RES*this.MAP_SCALE;
    }

    static UI_tilesToWorld(tile: integer): integer {
        return tile*this.UI_RES*this.UI_SCALE;
    }

}
