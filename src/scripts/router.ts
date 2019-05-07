/**
 * @license
 * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

interface Registration {
  path: RegExp;
  load(): Promise<Section>;
}

interface DocumentParts {
  main?: HTMLElement;
  header?: HTMLElement;
  styles?: HTMLStyleElement;
}

import { Section } from './section.js';
import { loadDocument, LoadedDocument } from './utils/load-document.js';

window.addEventListener('popstate', () => processUrl());

const sections = new Map<RegExp, {
  load: () => Promise<Section>,
  elements: Map<string, DocumentParts>,
  module?: Section,
}>();
export function register(registrations: Registration | Registration[]) {
  if (!Array.isArray(registrations)) {
    registrations = [registrations];
  }

  for (const {path, load} of registrations) {
    sections.set(path, { load, elements: new Map() });
  }
}

export async function go(url: string, data = {}) {
  window.history.pushState(data, '', url);
  await processUrl();
}

function getSectionRegExp(path: string): RegExp | undefined {
  for (const key of sections.keys()) {
    if (key.test(path)) {
      return key;
    }
  }
}

function getModule(name: string): Section {
  const sectionRegExp = getSectionRegExp(name);
  if (!sectionRegExp) {
    throw new Error(`Unable to find section: ${name}`);
  }

  const section = sections.get(sectionRegExp);
  if (!section || !section.module) {
    throw new Error(`Unable to find module for section: ${name}`);
  }

  return section.module;
}

function isLoadedDoc(item: Section | LoadedDocument): item is LoadedDocument {
  return typeof (item as LoadedDocument).header !== 'undefined';
}

let currentSection: string;
async function processUrl() {
  // Shut down the current section.
  if (currentSection) {
    await getModule(currentSection).finish();
  }

  // Grab the new section based on URL.
  const path = window.location.pathname;
  const sectionRegExp = getSectionRegExp(path);
  if (typeof sectionRegExp === 'undefined') {
    throw new Error(`Unknown section: ${path}`);
  }

  const section = sections.get(sectionRegExp);
  if (!section) {
    throw new Error(`Unable to find section: ${path}`);
  }

  // Load it if necessary.
  const toLoad: Array<Promise<Section | LoadedDocument>> = [];
  if (!section.module) {
    toLoad.push(section.load());
  }

  if (!section.elements.get(window.location.href)) {
    toLoad.push(loadDocument(window.location));
  }

  if (toLoad.length > 0) {
    const loadedItems = await Promise.all(toLoad);
    for (const item of loadedItems) {
      if (isLoadedDoc(item)) {
        section.elements.set(window.location.href, item);
      } else {
        section.module = item;
      }
    }

    // Store for future
    sections.set(sectionRegExp, section);
  }

  // if (load.length )
  //   const load = await Promise.all(toLoad);
  //   section.module = load[0] as Section;

  //   if (load.length === 2) {
  //     const loaded = load[1] as LoadedDocument;
  //     const documentParts = {
  //       header: document.adoptNode(loaded.header),
  //       main: document.adoptNode(loaded.main),
  //       styles: document.adoptNode(loaded.styles ||
  //           document.createElement('style'))
  //     };

  //     section.elements.set(window.location.href, documentParts);
  //   }

  //   sections.set(sectionRegExp, section);
  // }

  // If the path has changed by the end of the load then don't bother booting up
  // the new section.
  if (path !== window.location.pathname) {
    return;
  }

  const header = document.querySelector('app-header') as HTMLElement;
  header.classList.toggle('home-available', window.location.pathname !== '/');

  // Replace the current section's content.
  if (currentSection) {
    const elementParts = section.elements.get(window.location.href);
    const main = document.querySelector('main');
    if (!elementParts) {
      throw new Error('Section unpopulated');
    }

    if (!main || !elementParts.main) {
      throw new Error('No main in document, or section unpopulated');
    }

    // Clear out the existing main and populate with the new section's HTML.
    main.innerHTML = elementParts.main.innerHTML;

    // Next update the header.
    if (!header || !elementParts.header) {
      throw new Error('No header in document, or section unpopulated');
    }

    const headerStyle = elementParts.header.getAttribute('style');
    if (headerStyle) {
      header.setAttribute('style', headerStyle);
    } else {
      header.removeAttribute('style');
    }

    header.textContent = elementParts.header.textContent;

    // Finally any styles.
    const customStyles =
        document.head.querySelector('style[custom]') as HTMLStyleElement;

    if (elementParts.styles) {
      customStyles.textContent = elementParts.styles.textContent;
    } else {
      customStyles.textContent = '';
    }
  }

  const data = path
      .replace(sectionRegExp, '')
      .replace(/\/?$/, '')
      .split('/')
      .filter(p => !!p);
  currentSection = path;
  await getModule(currentSection).init(data);
}

export function init() {
  return processUrl();
}
