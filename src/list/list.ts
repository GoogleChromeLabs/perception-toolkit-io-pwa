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

import { html, parts, render } from 'lit-html';
import { repeat } from 'lit-html/directives/repeat.js';
import { ScannedItem } from '../defs/scanned-item.js';
import { Section } from '../scripts/section.js';
import * as store from '../scripts/store.js';

class List extends Section {
  private readonly key = 'scanned-items';
  private readonly onScannedItemChangeBound =
      this.onScannedItemChange.bind(this);
  private readonly onLaunchButtonClickBound =
      this.onLaunchButtonClick.bind(this);
  private main!: HTMLElement;

  async setup(parts?: string[]): Promise<void> {
    store.subscribe<ScannedItem[]>(this.key, this.onScannedItemChangeBound);
    this.main = document.querySelector('main') as HTMLElement;

    this.main.addEventListener('click', this.onLaunchButtonClickBound);

    const header = document.querySelector('app-header') as HTMLElement;
    header.classList.add('capture-available');
  }

  async teardown() {
    store.unsubscribe(this.key, this.onScannedItemChangeBound);

    // Clear Lit's tracking of main.
    parts.delete(this.main);

    this.main.removeEventListener('click', this.onLaunchButtonClickBound);

    const header = document.querySelector('app-header') as HTMLElement;
    header.classList.remove('capture-available');
  }

  onLaunchButtonClick(evt: Event) {
    const target = evt.target as HTMLElement;
    if (!target.id.startsWith('launch')) {
      return;
    }

    evt.stopImmediatePropagation();
    window.open(target.dataset.for);
  }

  onScannedItemChange(listItems?: ScannedItem[]) {
    let tmpl;

    const format = new Intl.DateTimeFormat('en-US', {
      day: 'numeric',
      hour: 'numeric',
      hour12: false,
      minute: 'numeric',
      month: 'numeric',
      second: 'numeric',
      year: 'numeric',
    });
    if (listItems && listItems.length > 0) {
      tmpl = html`
        <ul>
          ${repeat(listItems, (i) => i.url, (item, idx) => {
            const name = item.name ? item.name : 'Scanned Item';
            const id = `${name.replace(/\W/, '-').toLowerCase()}__${idx}`;
            return html`
              <li id="${id}">
                <a href="${item.url}">
                  <img src="${item.image}" alt="${name}">
                  <div class="details">
                    <div class="details__name">${name}</div>
                    <div class="details__scanned">Scanned:
                      <time>${format.format(item.scanned)}</time>
                    </div>
                  </div>
                </a>

                ${item.mainEntity ?
                  html`
                    <button data-for="${item.mainEntity.url}"
                            class="launch"
                            id="launch${idx}"
                            aria-labelledby="launch${idx} ${id}">Launch</button>` :
                  html``
                }
              </li>
            `;
          })}
        </ul>`;
    } else {
      tmpl = html`<div class="no-items">
        <div class="title">No items scanned yet.</div>
        <a href="/capture/">Start scanning</a>
      </div>`;
    }

    render(tmpl, this.main);
  }
}

export const toRemove = 'bar';
export default new List();
