/**
 * @license
 * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

const fs = require('fs');
const path = require('path');
const { visitUrls } = require('sitemap-generator');
const express = require('express');
const app = express();
const port = 3001;
const opts = {
  start: `http://localhost:${port}/sitemap.xml`,
  remap: `http://localhost:${port}`,
  dest: './dist/static/sitemap.jsonld',
  verbose: true,
  followLinks: true
}

app.use(express.static('./dist'));

const server = app.listen(port, async () => {
  const { dest, verbose } = opts;
  const jsonLds = await visitUrls(opts);
  const targets = Array.from(jsonLds.values());
  if (targets.length === 0) {
    if (verbose) {
      console.warn('Did not find any targets');
    }
    process.exit(0);
  }

  const contents = JSON.stringify(targets, null, 2);
  const destPath = path.join(process.cwd(), dest);
  if (verbose) {
    console.log(`[Write]: ${destPath}`);
  }

  fs.writeFile(destPath, contents, 'utf8', (err) => {
    if (err) {
      console.error(err.message);
      process.exit(1);
    }

    server.close(() => {
      process.exit(0);
    });
  });
});
