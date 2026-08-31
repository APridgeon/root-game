import Phaser from 'phaser';

/**
 * The fragment shader source for the PixelatedFX pipeline.
 * Performs a pixelation effect with weighted sampling of corner neighbors.
 */
const fragShader = `
    #define SHADER_NAME PIXELATED_FX'
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


export class PixelatedFXController extends Phaser.Filters.Controller {

  amount: integer = 4;
  shadows: {
    NE: number, SE: number,
    SW: number, NW: number
  } = {
      NE: 0.2, SE: 0, SW: 0, NW: 0
    }


  constructor(camera: Phaser.Cameras.Scene2D.Camera) {
    super(camera, 'PixelatedFX')
  }
}

export class PixelatedFX extends Phaser.Renderer.WebGL.RenderNodes.BaseFilterShader {

  constructor(manager: Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager) {
    super('PixelatedFX', manager, null, fragShader);
  }

  setupUniforms(controller: PixelatedFXController, drawingContext: Phaser.Renderer.WebGL.DrawingContext): void {
    const programManager = this.programManager;

    programManager.setUniform('resolution', [drawingContext.width, drawingContext.height]);
    programManager.setUniform('amount', controller.amount)
    programManager.setUniform('NE', controller.shadows.NE)
    programManager.setUniform('SE', controller.shadows.SE)
    programManager.setUniform('SW', controller.shadows.SW)
    programManager.setUniform('NW', controller.shadows.NW)
  }

}

