/**
 * @license
 * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

import typescript from 'rollup-plugin-typescript2';
import replace from 'rollup-plugin-replace';

const VERSION = require('./package.json').version;

export default [{
  input: [
    'src/sw/sw.ts',
  ],
  plugins: [
    typescript({
      tsconfig: "./src/sw/tsconfig.json"
    }),
    replace({
      delimiters: ['{@', '@}'],
      values: {
        VERSION
      }
    })
  ],
  output: {
    format: 'esm',
    file: 'dist/sw.js'
  }
}];
