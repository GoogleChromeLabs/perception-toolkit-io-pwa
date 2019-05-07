/**
 * @license
 * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

import { ScannedItem } from '../defs/scanned-item.js';
import * as Router from '../scripts/router.js';
import { Section } from '../scripts/section.js';
import * as store from '../scripts/store.js';

class Details extends Section {
  private readonly key = 'scanned-items';
  private readonly onShareClickBound = this.onShareClick.bind(this);
  private readonly onDeleteClickBound =
      this.onDeleteClick.bind(this);

  setup(parts?: string[]): Promise<void> {
    if (!parts || !parts.length) {
      Router.go('/');
      return Promise.resolve();
    }

    const shareButton = document.querySelector('#share') as HTMLElement;
    shareButton.classList.toggle('visible', 'share' in navigator);

    document.addEventListener('click', this.onShareClickBound);
    document.addEventListener('click', this.onDeleteClickBound);

    return new Promise((resolve) => {
      const appHeader = document.querySelector('app-header');
      if (!appHeader || appHeader.classList.contains('expanded')) {
        resolve();
        return;
      }
      appHeader.classList.add('expanded');
      appHeader.addEventListener('animationcomplete',
          () => resolve(), { once: true });
    });
  }

  teardown(): Promise<void> {
    document.removeEventListener('click', this.onShareClickBound);

    return new Promise((resolve) => {
      const appHeader = document.querySelector('app-header');
      if (!appHeader || !appHeader.classList.contains('expanded')) {
        resolve();
        return;
      }
      appHeader.classList.remove('expanded');
      appHeader.addEventListener('animationcomplete',
          () => resolve(), { once: true });
    });
  }

  async onShareClick(evt: Event) {
    const target = evt.target as HTMLElement;
    if (target.id !== 'share') {
      return;
    }

    evt.stopImmediatePropagation();
    if (!('share' in navigator)) {
      return;
    }

    const title = document.querySelector('h1')!.textContent || '';
    const url = window.location.toString();
    const text = `Check out ${title}: `;

    await navigator.share({
      text,
      title,
      url,
    });
  }

  async onDeleteClick(evt: Event) {
    const target = evt.target as HTMLElement;
    if (!target.id.startsWith('del')) {
      return;
    }

    evt.stopImmediatePropagation();
    if (!confirm('Are you sure you want to delete this?')) {
      return;
    }

    // Find and remove the chosen item.
    const items = await store.get<ScannedItem[]>(this.key);
    const startLength = items.length;
    const updatedItems =
        items.filter((i) => i.url !== window.location.toString());
    const endLength = updatedItems.length;

    if (startLength !== endLength) {
      await store.publish(this.key, updatedItems);
      Router.go('/list/');
    }
  }
}

export const toRemove = 'bar';
export default new Details();
