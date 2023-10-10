import { resolve } from 'path'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import babel from '@rollup/plugin-babel'
import json from '@rollup/plugin-json'
import dts from 'vite-plugin-dts'
import vue from 'rollup-plugin-vue'
import postcss from 'rollup-plugin-postcss'
import cssnano from 'cssnano'
import { terser } from 'rollup-plugin-terser'
import filesize from 'rollup-plugin-filesize'
const inputPath = resolve(__dirname, './src/index.ts')
const outputPath = (t) => resolve(__dirname, `./dist/index.${t}.js`)
const extensions = [
  '.js',
  '.jsx',
  '.ts',
  '.tsx',
  'vue'
]
const exclude = [
  '**/node_modules/**',
  '**/dist/**'
]

const globals = {
  vue: 'Vue',
  '@popperjs/core': 'Popperjs'
}

module.exports = {
  input: inputPath,
  output: [{
    file: outputPath('umd'),
    format: 'umd',
    name: 'index',
    exports: 'named',
    globals
  }, {
    file: outputPath('esm'),
    format: 'es',
    name: 'index.module',
    exports: 'named',
    globals
  }],
  plugins: [
    vue({
      preprocessStyles: true,
      postcssPlugins: [cssnano()]
    }),
    nodeResolve({
      extensions
    }),
    commonjs(),
    postcss(),
    json(),
    babel({
      exclude,
      babelHelpers: 'runtime',
      extensions
    }),
    dts({
      rollupTypes: true
    }),
    terser({
      compress: {
        // drop_console: true
      }
    }),
    filesize()
  ],
  external: ['vue', '@popperjs/core']
}
