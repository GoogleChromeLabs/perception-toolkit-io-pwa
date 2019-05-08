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

import { ScannedItem } from '../defs/scanned-item.js';
import * as Router from '../scripts/router.js';
import { Section } from '../scripts/section.js';
import * as Storage from '../scripts/store.js';

class Capture extends Section {
  private readonly onCaptureStartBound = this.onCaptureStart.bind(this);
  private readonly onCaptureCloseBound = this.onCaptureClose.bind(this);
  private readonly onMarkerChangesBound = this.onMarkerChange.bind(this);
  private readonly onCameraAccessDeniedBound =
      this.onCameraAccessDenied.bind(this);
  private readonly key = 'scanned-items';
  private container!: HTMLElement;

  async setup() {
    this.container = document.querySelector('.container') as HTMLElement;
    if (!this.container) {
      throw new Error('Unable to find container');
    }

    const header = document.querySelector('app-header') as HTMLElement;
    header.classList.remove('visible');

    const { Events, Functions } = window.PerceptionToolkit;
    Functions.initializeExperience();

    window.addEventListener(Events.CaptureStarted, this.onCaptureStartBound);
    window.addEventListener(Events.CaptureClosed, this.onCaptureCloseBound);
    window.addEventListener(Events.MarkerChanges, this.onMarkerChangesBound);
    window.addEventListener(Events.CameraAccessDenied,
        this.onCameraAccessDeniedBound);
  }

  async teardown() {
    const header = document.querySelector('app-header') as HTMLElement;
    header.classList.add('visible');

    const { Events, Functions } = window.PerceptionToolkit;

    window.removeEventListener(Events.CaptureStarted, this.onCaptureStartBound);
    window.removeEventListener(Events.CaptureClosed, this.onCaptureCloseBound);
    window.removeEventListener(Events.MarkerChanges, this.onMarkerChangesBound);
    window.removeEventListener(Events.CameraAccessDenied,
        this.onCameraAccessDeniedBound);

    Functions.closeExperience();

    const cards = document.querySelectorAll('data-card');
    for (const card of Array.from(cards)) {
      card.remove();
    }
  }

  private onCaptureStart() {
    // Prevent future onboarding flows beginning.
    window.PerceptionToolkit.config.onboarding = false;
    window.PerceptionToolkit.config.cardContainer =
        document.querySelector('.container');
  }

  private onCaptureClose() {
    Router.go('/list/');
    delete window.PerceptionToolkit.config.cardContainer;
  }

  private async onMarkerChange(evt: Event) {
    const markerEvent = evt as CustomEvent<{found: any[], lost: []}>;
    const { found, lost } = markerEvent.detail;
    const currentScannedItems = await Storage.get<ScannedItem[]>(this.key, []);
    const { Card } = window.PerceptionToolkit.Elements;

    // Getting an event with zero diff implies an invalid
    if (found.length === 0 && lost.length === 0) {
      // Take control of the UI rendering.
      evt.preventDefault();

      if (this.container.childNodes.length > 0) {
        return;
      }

      const card = new Card();
      card.classList.add('not-found');
      card.src = 'Sorry, that marker was not recognized.';
      this.container.appendChild(card);
      return;
    } else if (found.length > 0) {
      // Remove any 'can not find' cards.
      const notFoundCards =
          this.container.querySelectorAll('data-card.not-found');
      for (const nfCard of Array.from(notFoundCards)) {
        nfCard.remove();
      }
    }

    // Only add new items to the scan list.
    for (const newItem of found) {
      const existingItem = currentScannedItems.find((i) => {
        return i.url === newItem.content.url;
      });

      if (!existingItem) {
        currentScannedItems.push({...newItem.content, scanned: Date.now()});
      }
    }

    // Update the stored items.
    await Storage.publish(this.key, currentScannedItems);
  }

  private onCameraAccessDenied() {
    const { Card } = window.PerceptionToolkit.Elements;
    const card = new Card();
    card.src = 'Camera unavailable or access denied';
    this.container.appendChild(card);
  }
}

export const toRemove = 'bar';
export default new Capture();
