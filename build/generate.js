#!/usr/bin/env node
/**
 * @license
 * Copyright 2016 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const walk = require('walk');
const ignoreFiles = [
  'sw.js',
  'cache-manifest.js',
  '.DS_Store',
  'barcode-detection.js',
  'loader.js',
  'main.js',
  'onboarding.js'
];

const ignoreFolders = [
  '/node_modules/perception-toolkit/lib/src',
  '/node_modules/perception-toolkit/lib/defs',
  '/node_modules/perception-toolkit/lib/barcode-detection'
];

const fs = require('fs');
const resourceList = [];
const pathList = [
  '/',
  '/capture/',
  '/details/',
  '/details/squoosh.app/',
  '/list/',
  '/settings/',
];

const isValidFile = (name) => {
  const suffixes = ['js', 'css', 'json', 'png', 'svg', 'jpg', 'jsonld'];
  return suffixes.some(suffix => name.endsWith(suffix));
}

const walkStaticFiles = _ => {
  return new Promise((resolve) => {
    const walker = walk.walk('./dist');
    const staticFiles = [];
    walker.on('file', (root, fileStats, next) => {
      const name = fileStats.name;
      if (ignoreFiles.indexOf(name) !== -1 ||
          ignoreFolders.findIndex(f => root.indexOf(f) !== -1) !== -1) {
        return next();
      }

      if (!isValidFile(name)) {
        return next();
      }

      root = root.replace(/^\.\/dist/, '');
      staticFiles.push(`${root}/${name}`);

      next();
    });

    walker.on('end', _ => resolve(staticFiles));
  });
};

walkStaticFiles().then((resources) => {
  resourceList.push(...resources);

  const manifest = [
    `export const pathManifest = ${JSON.stringify(pathList, null, 2)}\n`,
    `export const cacheManifest = ${JSON.stringify(resourceList, null, 2)};\n`
  ].join('\n');

  fs.writeFile('./src/sw/cache-manifest.ts', manifest, (err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
  });
});
