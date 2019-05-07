/**
 * @license
 * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

import * as IDBKeyVal from 'idb-keyval';

interface ModelCallback {
  (value: any): void;
}

const subscribers: Map<string, ModelCallback[]> =
    new Map<string, ModelCallback[]>();
export async function subscribe<T = {}>(name: string, subscriber: ModelCallback) {
  let subscriberList = subscribers.get(name);
  if (!subscriberList) {
    subscriberList = [];
  }

  subscriberList.push(subscriber);
  subscribers.set(name, subscriberList);

  const data = await IDBKeyVal.get(name) as T;
  subscriber(data);
}

export function unsubscribe<T = {}>(name: string, subscriber: ModelCallback) {
  const subscriberList = subscribers.get(name);
  if (!subscriberList) {
    return;
  }

  const idx = subscriberList.findIndex((s) => s === subscriber);
  if (idx === -1) {
    return;
  }

  subscriberList.splice(idx, 1);
  subscribers.set(name, subscriberList);
}

export async function publish(name: string, value: any) {
  await IDBKeyVal.set(name, value);

  const subscriberList = subscribers.get(name);
  if (!subscriberList) {
    return;
  }

  for (const subscriber of subscriberList) {
    subscriber(value);
  }
}

export async function get<T = {}>(name: string, def?: T): Promise<T> {
  const value = await IDBKeyVal.get(name) as T;
  if (!value && def) {
    await IDBKeyVal.set(name, def);
    return def;
  }

  return value;
}

export async function clear(name?: string) {
  const keys = await IDBKeyVal.keys();
  for (const key of keys) {
    if (!name || key === name) {
      console.log(`Deleting ${key}`);
      await IDBKeyVal.del(key);
    }
  }
}
