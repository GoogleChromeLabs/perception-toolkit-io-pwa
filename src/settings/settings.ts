/**
 * @license
 * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
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
