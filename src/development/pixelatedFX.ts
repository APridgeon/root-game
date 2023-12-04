import * as Phaser from 'phaser';



const fragShader = `
    #define SHADER_NAME PIXELATE_FS'
    precision mediump float;
    uniform sampler2D uMainSampler;
    uniform vec2 resolution;
    uniform float amount;
    varying vec2 outTexCoord;
    void main ()
    {
        float pixelSize = floor(2.0 + amount);
        vec2 center = pixelSize * floor(outTexCoord * resolution / pixelSize) + pixelSize * vec2(0.5, 0.5);
        vec2 corner1 = center + pixelSize * vec2(-0.5, -0.5);
        vec2 corner2 = center + pixelSize * vec2(+0.5, -0.5);
        vec2 corner3 = center + pixelSize * vec2(+0.5, +0.5);
        vec2 corner4 = center + pixelSize * vec2(-0.5, +0.5);
        vec4 pixel = 1.0 * texture2D(uMainSampler, center / resolution);

        gl_FragColor = pixel;
    }
`;


export default class PixelatedFX extends Phaser.Renderer.WebGL.Pipelines.PostFXPipeline
{
    constructor (game)
    {
        super({
            game,
            renderTarget: true,
            fragShader,
            uniforms: [
                'uProjectionMatrix',
                'uMainSampler',
                'uTime',
                'resolution',
                'amount'
            ]
        });
    }

    onBoot ()
    {
        this.set2f('resolution', this.renderer.width, this.renderer.height);
    }

    onPreRender ()
    {
        this.set1f('uTime', this.game.loop.time / 1000);
        this.set1f('amount', 0);
    }
}