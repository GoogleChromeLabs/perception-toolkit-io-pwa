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


import { Section } from '../scripts/section.js';
import * as store from '../scripts/store.js';

class Settings extends Section {
  private readonly onClearBound = this.onClear.bind(this);

  async setup(parts?: string[]) {
    const clearDataButton =
        document.querySelector('#clear-data') as HTMLButtonElement;
    if (!clearDataButton) {
      console.warn('Clear Data button unavailable');
      return;
    }
    clearDataButton.addEventListener('click', this.onClearBound);
  }

  async teardown() {
    const clearDataButton =
        document.querySelector('#clear-data') as HTMLButtonElement;
    if (!clearDataButton) {
      console.warn('Clear Data button unavailable');
      return;
    }
    clearDataButton.removeEventListener('click', this.onClearBound);
  }

  async onClear() {
    if (!confirm('Are you sure you want to reset?')) {
      return;
    }

    await store.clear();
    const reg = await navigator.serviceWorker.getRegistration();
    if (reg) {
      await reg.unregister();
    }
    const cacheNames = await caches.keys();
    for (const cacheName of cacheNames) {
      await caches.delete(cacheName);
    }

    alert('All clear');
    window.location.href = '/';
  }
}

export const toRemove = 'bar';
export default new Settings();
