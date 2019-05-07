/**
 * @license
 * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
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
