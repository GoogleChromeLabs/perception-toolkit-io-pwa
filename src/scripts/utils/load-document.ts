/**
 * @license
 * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

export interface LoadedDocument {
  main: HTMLElement;
  header: HTMLElement;
  styles?: HTMLStyleElement;
}

export async function loadDocument(url: Location): Promise<LoadedDocument> {
  const response = await fetch(url.href);
  const content = await response.text();

  const parser = new DOMParser();
  const document = parser.parseFromString(content, 'text/html');
  if (document.querySelector('parsererror')) {
    throw new Error(`Unable to load: ${url.href}`);
  }

  const main = document.querySelector('main') as HTMLElement;
  const header = document.querySelector('app-header') as HTMLElement;
  const styles =
      document.head.querySelector('style[custom]') as HTMLStyleElement;
  if (!main || !header) {
    throw new Error(`${url.href} has no <main> or <app-header>`);
  }

  return { main, header, styles };
}
