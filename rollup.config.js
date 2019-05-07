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
import nodeResolve from 'rollup-plugin-node-resolve';
import loadz0r from 'rollup-plugin-loadz0r';
import { terser } from 'rollup-plugin-terser';

require('rimraf').sync('dist');
require('rimraf').sync('bundled');

export default [{
  input: [
    'src/scripts/app.ts',
    'src/index.ts',
    'src/list/list.ts',
    'src/settings/settings.ts',
    'src/details/details.ts',
    'src/capture/capture.ts',
  ],
  plugins: [
    typescript({
      target: 'es2015',
      module: 'esnext'
    }),
    nodeResolve(),
    loadz0r({ publicPath: '/bundled'}),
    terser()
  ],

  output: {
    dir: 'bundled',
    format: 'amd',
    exports: 'named'
  }
}];
