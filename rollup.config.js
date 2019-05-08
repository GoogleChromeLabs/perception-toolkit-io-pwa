/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import typescript from 'rollup-plugin-typescript2';
import nodeResolve from 'rollup-plugin-node-resolve';
import loadz0r from 'rollup-plugin-loadz0r';
import { terser } from 'rollup-plugin-terser';
import license from 'rollup-plugin-license';

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
    terser(),
    license({
      sourcemap: true,

      banner: `
@license
Copyright 2019 Google LLC

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    https://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
      `
    })
  ],

  output: {
    dir: 'bundled',
    format: 'amd',
    exports: 'named'
  }
}];
