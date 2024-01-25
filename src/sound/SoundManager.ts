import * as Phaser from "phaser";
import { Events } from "../events/events";
import Synth from "./Synth";

class SoundManager {

    private _scene: Phaser.Scene;

    private ctx: AudioContext;
    private synth: Synth;

    private soundEvent: Phaser.Time.TimerEvent;

    private notes: number[] = [130.81, 146.83,  164.81, 196.00, 220.00];
    private times: number[] = [500, 250, 125];

    constructor(scene: Phaser.Scene){

            this._scene = scene;

            this.initContext();

            this.generalSounds();

            // this._scene.events.on(Events.RootGrowthSuccess, () => {
            //     console.log('PLAY')
            //     let note = this.notes[Phaser.Math.RND.integerInRange(0, this.notes.length - 1)];
            //     this.playNote(note, 0.4);
            // })


    }

    private initContext(): void {
        this._scene.input.once('pointerdown', () => {
            this.ctx = new AudioContext();
            this.synth = new Synth(this.ctx, this._scene);

            this._scene.events.emit('audio Initiated');
        })
    }

    private generalSounds(): void {
        this._scene.events.on('audio Initiated', () => {

            this.soundEvent = this._scene.time.addEvent({
                delay: 500,
                loop: true,
                callback: () => {
                    let note = this.notes[Phaser.Math.RND.integerInRange(0, this.notes.length - 1)];
                    let time = this.times[Phaser.Math.RND.integerInRange(0, this.times.length - 1)];
                    this.synth.playNote(note, 0.49);
                    // @ts-ignore
                    this.soundEvent.delay = time;

                }
            })

        })

    }




}


export default SoundManager;
