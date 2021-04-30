/* eslint-disable @typescript-eslint/no-var-requires */
/**
 * This file is meant to be used as helper for compiled TypeScript source.
 * The point of this file is to file relative paths built from TypeScript source files.
 * Example:
 *   node -r ./tsconfig-paths-bootstrap.js ./build/index.js
 *
 * Credit goes to:
 *   https://gist.github.com/claudioluciano/6b1ed564c4f8225139cc2d72314e7558
 */
const fs = require('fs')
const JSON5 = require('json5')
const tsConfigPaths = require('tsconfig-paths')

const tsConfigStringify = fs.readFileSync('./tsconfig.json')
const tsConfig = JSON5.parse(tsConfigStringify)

const paths = tsConfig.compilerOptions.paths

tsConfigPaths.register({
  baseUrl: tsConfig.compilerOptions.outDir,
  paths: Object.keys(paths).reduce(
    (agg, key) => ({
      ...agg,
      [key]: paths[key].map((path) =>
        path.replace(tsConfig.compilerOptions.baseUrl, tsConfig.compilerOptions.outDir),
      ),
    }),
    {},
  ),
})
