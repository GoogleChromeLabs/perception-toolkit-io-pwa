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

import * as Router from '../../router.js';
import { fire } from '../../utils/fire.js';
import { html, styles } from './app-header.template.js';
export class AppHeader extends HTMLElement {
  private readonly root = this.attachShadow({mode: 'open'});

  constructor() {
    super();

    this.root.innerHTML = `<style>${styles}</style>${html}`;

    this.root.addEventListener('transitionend', () => {
      fire('animationcomplete', this);
    });

    this.root.addEventListener('click', (evt) => {
      const target = evt.target as HTMLAnchorElement;
      if (target.tagName !== 'A') {
        return;
      }

      evt.preventDefault();
      Router.go(target.href);
    });
  }

  connectedCallback() {
    this.classList.add('visible');
  }
}
