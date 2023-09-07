import Game_Config from "../../game_config";
import { Events } from "../../events/events";
import { TimeOfDay } from "../../general/timeOfDay";



class SkyManager {

    private _scene: Phaser.Scene;
    private timeOfDay: TimeOfDay;
    private timeOfDaySkyTextures: Map<TimeOfDay, string>;
    private skyResolution = 150;
    private transitionDuration = 5000;

    private _tilemap: Phaser.Tilemaps.Tilemap;
    private _currentTileLayer: Phaser.Tilemaps.TilemapLayer;
    private _newTileLayer: Phaser.Tilemaps.TilemapLayer;
    private _currentTileSet: Phaser.Tilemaps.Tileset;
    private _newTileSet: Phaser.Tilemaps.Tileset;

    private clouds: Phaser.GameObjects.Image;
    private cloudsAlphaTween: Phaser.Tweens.Tween;


    constructor(tilemap: Phaser.Tilemaps.Tilemap, scene: Phaser.Scene){
        this._scene = scene;

        this.timeOfDay = TimeOfDay.Dawn;
        this._tilemap = tilemap;

        this.generateTilesets();
        this.setupSkyTileLayer();
        this.setupEvents();

        this.generateClouds();
    }

    private generateTilesets(): void {

        this.timeOfDaySkyTextures = new Map([
            [TimeOfDay.Dawn, 'sky-dawn'],
            [TimeOfDay.Noon, 'sky-noon'],
            [TimeOfDay.Sunset, 'sky-sunset'],
            [TimeOfDay.Dusk, 'sky-dusk'],
            [TimeOfDay.Night, 'sky-night']
        ])

        this._currentTileSet = this._tilemap.addTilesetImage('current', this.timeOfDaySkyTextures.get(this.timeOfDay), this.skyResolution, this.skyResolution, 0, 0);
        this._newTileSet = this._tilemap.addTilesetImage('new', this.timeOfDaySkyTextures.get(this.timeOfDay), this.skyResolution, this.skyResolution, 0, 0);

    }

    private setupSkyTileLayer(): void {
        this._currentTileLayer = this._tilemap.createBlankLayer('skyBackground', this._currentTileSet, 0,  0, Math.round((Game_Config.MAP_tilesToWorld(Game_Config.MAP_SIZE.x))/this.skyResolution) + 1, 1)
            .setAlpha(1)
            .setDepth(-5)
            .setOrigin(0, 0)
            .setScale(((Game_Config.MAP_SCALE/Game_Config.MAP_RES)*(this.skyResolution)))
            .forEachTile(tile => tile.index = 0);


        this._newTileLayer = this._tilemap.createBlankLayer('newSkyBackground', this._newTileSet, 0, 0, Math.round((Game_Config.MAP_tilesToWorld(Game_Config.MAP_SIZE.x))/this.skyResolution) + 1, 1)
            .setAlpha(0)
            .setOrigin(0, 0)
            .setScale(((Game_Config.MAP_SCALE/Game_Config.MAP_RES)*(this.skyResolution)))
            .forEachTile(tile => tile.index = 0);
    }

    private setSkyTileSetTransition(){
        let newTexture = this._scene.textures.get(this.timeOfDaySkyTextures.get(this.timeOfDay))
        this._newTileSet.setImage(newTexture);

        this._scene.tweens.add({
            targets: this._newTileLayer,
            duration: this.transitionDuration,
            alpha: 1,
            ease: 'linear',
            onComplete: () => {
                this._currentTileSet.setImage(newTexture);
                this._newTileLayer.setAlpha(0);
            }
        })
    }

    private setupEvents(){
        this._scene.events.on(Events.TimeOfDayChange, (timeOfDay: TimeOfDay) => {
            this.timeOfDay = timeOfDay;
            this.setSkyTileSetTransition();
            this.removeCloudsAtNight();
        })
    }

    private generateClouds(): void {
        this.clouds = this._scene.add.image(Game_Config.MAP_tilesToWorld(5), Game_Config.MAP_tilesToWorld(7), 'clouds')
            .setOrigin(0)
            .setScale(Game_Config.MAP_SCALE);

        this._scene.time.addEvent({
            delay: 300,
            loop: true,
            callback: () => {
                this.clouds.x += Game_Config.MAP_SCALE;
                if(this.clouds.x > Game_Config.MAP_tilesToWorld(Game_Config.MAP_SIZE.x)){
                    this.clouds.x = 0 - (this.clouds.width * Game_Config.MAP_SCALE);
                }
            }
        })

        this.cloudsAlphaTween = this._scene.tweens.add({
            targets: this.clouds,
            paused: true,
            ease: 'expo',
            alpha: 0,
            duration: Game_Config.DAY_SEGMENT_LENGTH/2,
            yoyo: true,
            repeat: -1,
            onRepeat: () => {this.cloudsAlphaTween.pause()}
        })
    }

    private removeCloudsAtNight(): void {
        if(this.timeOfDay === TimeOfDay.Night){
            this.cloudsAlphaTween.play();
        }
    }

}

export default SkyManager;