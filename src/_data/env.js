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
