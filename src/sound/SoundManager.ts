import * as Phaser from "phaser";
import { Events } from "../events/events";

class SoundManager {

    private _scene: Phaser.Scene;

    private ctx: AudioContext;
    private gain: GainNode;
    private pan: StereoPannerNode;
    private osc: OscillatorNode;
    private osc_effects: OscillatorNode;

    private notes: number[] = [261, 293, 329, 392, 440];

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
            this.gain = this.ctx.createGain();
            this.gain.gain.value = 0;
            this.gain.connect(this.ctx.destination);
            this.pan = this.ctx.createStereoPanner();
            this.pan.connect(this.gain);
            this.pan.pan.value = -1;

            this.osc = this.ctx.createOscillator();
            this.osc.connect(this.pan);
            this.osc.type = 'triangle';
            this.osc.frequency.value = 0;
            this.osc.start();

            this._scene.events.emit('audio Initiated');
        })
    }

    private generalSounds(): void {
        this._scene.events.on('audio Initiated', () => {

            this._scene.time.addEvent({
                delay: 500,
                loop: true,
                callback: () => {
                    let note = this.notes[Phaser.Math.RND.integerInRange(0, this.notes.length - 1)];
                    this.playNote(note, 0.49);

                }
            })

        })
    }

    private playNote(freq: number, length: number): void {

        this.osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        this.gain.gain.linearRampToValueAtTime(0.5, this.ctx.currentTime + length);
        this.gain.gain.setValueAtTime(0.001, this.ctx.currentTime + length);
    }


}


export default SoundManager;
