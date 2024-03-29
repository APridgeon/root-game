import Box from "./boxes/box";
import GuideBox from "./boxes/guideBox";
import UI from "./UI_scene";
import UI_TileSets, { BoxTiles } from "./UI_TileSets";


export default class GuideManager {

    _scene: UI;

    instructionBox: Box;

    constructor(scene: UI){
        this._scene = scene;

        new GuideBox('TUTORIAL', 'Welcome to TAPROOT\nClick to grow roots!', this._scene, UI_TileSets.boxStyle3, 30, 30);
    }

}