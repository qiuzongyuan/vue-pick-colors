import { resolve } from 'path'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import babel from '@rollup/plugin-babel'
import json from '@rollup/plugin-json'
import typescript from 'rollup-plugin-typescript2'
import vue from 'rollup-plugin-vue'
import postcss from 'rollup-plugin-postcss'
import cssnano from 'cssnano'
import { terser } from 'rollup-plugin-terser'
import filesize from 'rollup-plugin-filesize'
const inputPath = resolve(__dirname, './src/index.ts')
const outputPath = (t) => resolve(__dirname, `./dist/index.${t}.js`)
const pathResolve = (p) => resolve(__dirname, p)
const extensions = [
  '.js',
  '.jsx',
  '.ts',
  '.tsx',
  'vue'
]
const exclude = [
  '**/node_modules/**',
  '**/dist/**',
]

const globals = {
  vue: 'vue'
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
    typescript({
      tsconfig: pathResolve('./tsconfig.json')
    }),
    vue(),
    nodeResolve({
      extensions
    }),
    commonjs(),
    postcss({
      plugins: [
        cssnano()
      ],
      extensions: ['.less', '.css']
    }),
    json(),
    babel({
      exclude,
      babelHelpers: 'runtime',
      extensions
    }),
    terser(),
    filesize()
  ],
  external: ['vue']
}
