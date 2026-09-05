import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import serve from 'rollup-plugin-serve';
import typescript from '@rollup/plugin-typescript';

export default {
  // Our game entry point
  input: [
    './src/gameManager/gameManager.ts'
  ],

  // Where the build file is generated
  output: {
    file: './dist/game.js',
    name: 'MyGame',
    format: 'iife',
    sourcemap: true,
    intro: 'var global = window;'
  },

  plugins: [
    // Toggle the booleans here to enable / disable Phaser 3 features:
    replace({
      preventAssignment: true,
      'typeof CANVAS_RENDERER': JSON.stringify(true),
      'typeof WEBGL_RENDERER': JSON.stringify(true),
      'typeof WEBGL_DEBUG': JSON.stringify(true),
      'typeof EXPERIMENTAL': JSON.stringify(true),
      'typeof PLUGIN_CAMERA3D': JSON.stringify(false),
      'typeof PLUGIN_FBINSTANT': JSON.stringify(false),
      'typeof FEATURE_SOUND': JSON.stringify(true)
    }),

    // FIXED: Include .js and .mjs extensions alongside TypeScript
    nodeResolve({
      extensions: ['.js', '.mjs', '.ts', '.tsx'],
      browser: true
    }),

    // FIXED: Convert CJS modules across all dependencies (including nested eventemitter3)
    commonjs({
      include: [
        /node_modules\/eventemitter3/,
        /node_modules\/phaser4-rex-plugins\/node_modules\/eventemitter3/,
        /node_modules\/phaser/
      ],
      exclude: [
        'node_modules/phaser/src/polyfills/requestAnimationFrame.js',
        'node_modules/phaser/src/phaser-esm.js'
      ],
      sourceMap: true,
      ignoreGlobal: true
    }),

    // Parse TypeScript files
    typescript(),

    // Dev server configuration
    serve({
      open: true,
      contentBase: 'dist',
      host: 'localhost',
      port: 8080,
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    })
  ]
};
