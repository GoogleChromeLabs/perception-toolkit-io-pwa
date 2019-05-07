/**
 * @license
 * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */
import { cacheManifest, pathManifest } from './cache-manifest';

declare var self: ServiceWorkerGlobalScope;

const NAME = 'io-sandbox-scanner';
const VERSION = '{@VERSION@}';

self.oninstall = (evt) => {
  evt.waitUntil(
    caches
      .open(`${NAME}-v${VERSION}`)
      .then(newCache => {
        const toCache = [
          ...pathManifest,
          ...cacheManifest
        ];

        return toCache.map((url) => {
          const urlParts = url.split('|');
          const srcUrl = urlParts[0];
          const destUrl = urlParts.length === 2 ? urlParts[1] : urlParts[0];

          console.log(`Getting ${srcUrl} from network.`);
          return fetch(srcUrl)
              .then(response => {
                if (destUrl === '/404/') {
                  response = new Response(response.body, {
                    headers: response.headers,
                    status: 404,
                    statusText: 'Not Found',
                  });
                }

                newCache.put(destUrl, response);
              });
        });
      })
  );

  self.skipWaiting();
};

self.onactivate = _ => {
  const currentCacheName = `${NAME}-v${VERSION}`;
  caches.keys().then(cacheNames => {
    return Promise.all(
      cacheNames.map((cacheName) => {
        if (cacheName.indexOf(NAME) === -1) {
          return Promise.resolve(true);
        }

        if (cacheName !== currentCacheName) {
          return caches.delete(cacheName);
        }

        return Promise.resolve(true);
      })
    );
  });

  self.clients.claim();
};

self.onmessage = evt => {
  const action = evt.data.action;
  if (!action || !evt.source) {
    console.warn('Message received with no action:', evt);
    return;
  }

  switch (action) {
    case 'version':
      evt.source.postMessage({
        version: VERSION
      });
      return;
  }
};

self.onfetch = (evt: FetchEvent) => {
  const request = evt.request;

  evt.respondWith(
    // Check the cache for a hit.
    caches.match(request).then(async (response) => {
      // If we have a response return it.
      if (response) {
        return response;
      }

      const fetchedResponse = await fetch(request);

      if (fetchedResponse) {
        const cacheName = request.url.endsWith('.wasm') ?
            'wasm' :
            `${NAME}-v${VERSION}`;
        const cache = await caches.open(cacheName);
        cache.put(request, fetchedResponse.clone());
        console.log(`Storing ${request.url} in ${cacheName} for future requests.`);
        return fetchedResponse;
      }

      // And worst case we fire out a not found.
      return new Response('Sorry, not found');
    })
  );
};
