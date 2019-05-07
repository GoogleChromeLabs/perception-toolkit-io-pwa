/**
 * @license
 * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

import { AppHeader } from './components/app-header/app-header.js';
import * as Router from './router.js';

if (!customElements.get('app-header')) {
  customElements.define('app-header', AppHeader);
}

declare global {
  interface Window {
    PerceptionToolkit: any;
  }
  interface Navigator {
    share(opts: {
      title: string;
      text: string;
      url: string;
    }): void;
  }
}

class App {
  constructor() {
    Router.register([{
      load: () => import('../index.js').then(m => m.default),
      path: /^\/$/
    }, {
      load: () => import('../list/list.js').then(m => m.default),
      path: /^\/list\//
    }, {
      load: () => import('../settings/settings.js').then(m => m.default),
      path: /^\/settings\//,
    }, {
      load: () => import('../details/details.js').then(m => m.default),
      path: /^\/details\//,
    }, {
      load: () => import('../capture/capture.js').then(m => m.default),
      path: /^\/capture\//,
    }]);

    Router.init().then(() => {
      this.hijackLinks();
      this.initServiceWorker();
    });

    const shareApp = document.querySelector('#share-app');
    if (!(shareApp && ('share' in navigator))) {
      return;
    }

    shareApp.classList.add('visible');
    shareApp.addEventListener('click', () => {
      navigator.share({
        text: 'Check out the Web Sandbox PWA',
        title: 'Google I/O - Web Sandbox',
        url: window.location.origin,
      });
    });
  }

  private hijackLinks() {
    let transitioning = false;
    document.addEventListener('click', async (evt) => {
      const target = evt.target as HTMLAnchorElement;
      if (target.tagName !== 'A') {
        return;
      }

      // If not this origin then treat as a typical anchor.
      const targetUrl = new URL(target.href, window.location.toString());
      if (targetUrl.origin !== window.location.origin) {
        return;
      }

      evt.preventDefault();

      // Bail if we're already handling a change.
      if (transitioning) {
        return;
      }

      transitioning = true;
      await Router.go(target.href);
      transitioning = false;
    });
  }

  private async initServiceWorker() {
    await navigator.serviceWorker.register('/sw.js');
  }
}

// tslint:disable-next-line:no-unused-expression
new App();
