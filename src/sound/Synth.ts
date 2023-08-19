
class Synth {

    private _scene: Phaser.Scene;
    private _ctx: AudioContext;

    public volume: number = 0.1;

    private gain: GainNode;
    private pan: StereoPannerNode;
    private osc: OscillatorNode;

    private oscType: OscillatorType = 'sine';

    constructor(ctx: AudioContext, scene: Phaser.Scene){
        this._scene = scene;
        this._ctx = ctx;

        this.generateSynth();
    }

    private generateSynth(): void{

        this.gain = this._ctx.createGain();
        this.gain.gain.value = 0;
        this.gain.connect(this._ctx.destination);
        this.pan = this._ctx.createStereoPanner();
        this.pan.connect(this.gain);
        this.pan.pan.value = 0;

        this.osc = this._ctx.createOscillator();
        this.osc.connect(this.pan);
        this.osc.type = this.oscType;
        this.osc.frequency.value = 0;
        this.osc.start();

    }

    public playNote(freq: number, length: number): void {

        this.osc.frequency.setValueAtTime(freq, this._ctx.currentTime);
        this.gain.gain.linearRampToValueAtTime(this.volume, this._ctx.currentTime + length);
        this.gain.gain.setValueAtTime(0.001, this._ctx.currentTime + length);
    }

}

export default Synth;