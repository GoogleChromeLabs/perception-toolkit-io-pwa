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
