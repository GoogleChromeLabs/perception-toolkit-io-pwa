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
