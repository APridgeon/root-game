import { Scene, Time } from "phaser";
import { Events } from "../events/events";
import Game_Config from "../game_config";

export enum TimeOfDay {
    Dawn = 0,
    Noon = 1,
    Sunset = 2,
    Dusk = 3,
    Night = 4
}

class TimeOfDayManager {

    private _scene: Phaser.Scene;

    private _startDaySegment = TimeOfDay.Dawn;
    private _daySegmentLength = Game_Config.DAY_SEGMENT_LENGTH;
    private _nextSegmentChange: number;

    public timeOfDay: TimeOfDay;

    constructor(scene: Phaser.Scene){
        this._scene = scene;

        this.setupTime();
        this.setupDayLoop();
    }

    private setupTime(): void {
        this.timeOfDay = this._startDaySegment;
        this._nextSegmentChange = this._scene.time.now + this._daySegmentLength;
    }

    private setNextDaySegment(): void {
        if(this.timeOfDay.valueOf() === 4){
            this.timeOfDay = 0 as TimeOfDay;
        } else {
            this.timeOfDay = (this.timeOfDay.valueOf() + 1) as TimeOfDay;
        }
    }

    private setupDayLoop(): void {
        this._scene.time.addEvent({
            delay: this._daySegmentLength,
            loop: true,
            callback: () => {
                this.setNextDaySegment();
                this._nextSegmentChange = this._scene.time.now + this._daySegmentLength;
                this._scene.events.emit(Events.TimeOfDayChange, this.timeOfDay);
                console.log(`Time has changed: ${this.timeOfDay}`);
            }

        })
    }



}

export default TimeOfDayManager;