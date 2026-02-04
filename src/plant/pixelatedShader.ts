import * as Phaser from 'phaser';

/**
 * The fragment shader source for the PixelatedFX pipeline.
 * Performs a pixelation effect with weighted sampling of corner neighbors.
 */
const fragShader = `
    #define SHADER_NAME PIXELATE_FS'
    precision mediump float;
    uniform sampler2D uMainSampler;
    uniform vec2 resolution;
    uniform float amount;
    uniform float SW ;
    uniform float SE ;
    uniform float NE ;
    uniform float NW ;
    varying vec2 outTexCoord;
    void main ()
    {
        float pixelSize = floor(2.0 + (amount));
        vec2 center = pixelSize * floor(outTexCoord * resolution / pixelSize) + pixelSize * vec2(0.5, 0.5);
        vec2 corner1 = center + pixelSize * vec2(-0.5, -0.5);
        vec2 corner2 = center + pixelSize * vec2(+0.5, -0.5);
        vec2 corner3 = center + pixelSize * vec2(+0.5, +0.5);
        vec2 corner4 = center + pixelSize * vec2(-0.5, +0.5);
        vec4 pixel = 1.0 * texture2D(uMainSampler, center / resolution);
        pixel += SW * texture2D(uMainSampler, corner1 / resolution);
        pixel += SE * texture2D(uMainSampler, corner2 / resolution);
        pixel += NE * texture2D(uMainSampler, corner3 / resolution);
        pixel += NW * texture2D(uMainSampler, corner4 / resolution);

        gl_FragColor = pixel;
    }
`;

/**
 * A Post-Processing pipeline that applies a pixelation effect with customizable 
 * corner shadow intensities.
 * * @extends Phaser.Renderer.WebGL.Pipelines.PostFXPipeline
 */
export default class PixelatedFX extends Phaser.Renderer.WebGL.Pipelines.PostFXPipeline
{
    /**
     * The size of the pixels. Higher values result in larger pixels.
     * @default 4
     */
    public amount: number = 4;

    /**
     * Weighting factors for the corner samples (North-East, South-East, South-West, North-West).
     * These affect how neighboring pixel colors bleed into the center.
     */
    public shadows: { NE: number; SE: number; SW: number; NW: number } = { NE: 0.2, SE: 0, SW: 0, NW: 0 };

    /**
     * @param game - A reference to the Phaser Game instance.
     */
    constructor (game: Phaser.Game)
    {
        super({
            game,
            renderTarget: true,
            fragShader,
            /* @ts-ignore */
            uniforms: [
                'uProjectionMatrix',
                'uMainSampler',
                'resolution',
                'amount',
                'NE',
                'SE',
                'SW',
                'NW'
            ]
        });
    }

    /**
     * Called when the pipeline is booted by the Pipeline Manager.
     * Sets the initial resolution uniform based on the renderer size.
     */
    onBoot (): void
    {
        this.set2f('resolution', this.renderer.width, this.renderer.height);
    }

    /**
     * Called every frame before the pipeline draws.
     * Updates the shader uniforms with the current property values.
     */
    onPreRender (): void
    {
        this.set1f('amount', this.amount);
        this.set1f('NE', this.shadows.NE);
        this.set1f('SE', this.shadows.SE);
        this.set1f('SW', this.shadows.SW);
        this.set1f('NW', this.shadows.NW);
    }

    /**
     * Conveniently updates the effect parameters in one call.
     * * @param amount - The new pixel size.
     * @param shadows - An object containing the new weights for each corner.
     */
    public setup (amount: number, shadows: { NE: number; SE: number; SW: number; NW: number }): void
    {
        this.amount = amount;
        this.shadows = {
            NE: shadows.NE,
            SE: shadows.SE,
            SW: shadows.SW,
            NW: shadows.NW
        };
    }
}