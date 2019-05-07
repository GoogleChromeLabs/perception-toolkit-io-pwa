/**
 * @license
 * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

function buildDate() {
  const d = new Date();
  const pad = (n) => n.toString().padStart(2, '0');

  const yy = pad(d.getFullYear());
  const mm = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const hh = pad(d.getUTCHours());
  const mn = pad(d.getUTCMinutes());
  const ss = pad(d.getUTCSeconds());

  return `${yy}-${mm}-${dd}T${hh}:${mn}:${ss}`;
}

const { version } = require('../../package.json');

module.exports = {
  origin: process.env.ELEVENTY_ENV === 'development' ?
      'http://localhost:8080' : 'http://io-web-sandbox.firebaseapp.com',
  buildDate: buildDate(),
  version
};
