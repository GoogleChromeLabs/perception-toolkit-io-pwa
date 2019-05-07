/**
 * @license
 * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

import { fade } from './utils/fade.js';

enum SectionState {
  INITIALIZING = 'initializing',
  TEARING_DOWN = 'tearingdown',
  ACTIVE = 'active',
  INACTIVE = 'inactive'
}

export interface Section {
  init(parts?: string[]): Promise<void>;
  finish(): Promise<void>;
}

export abstract class Section implements Section {
  private state = SectionState.INACTIVE;

  abstract async teardown(): Promise<void>;
  abstract async setup(parts?: string[]): Promise<void>;

  async init(parts?: string[]) {
    if (this.state === SectionState.ACTIVE ||
        this.state === SectionState.INITIALIZING) {
      return;
    }

    this.state = SectionState.INITIALIZING;
    await this.setup(parts);

    // Check it's not been interrupted.
    if (this.state !== SectionState.INITIALIZING) {
      return;
    }

    this.state = SectionState.ACTIVE;

    const main = document.querySelector('main') as HTMLElement;
    await fade(main, { from: 0, to: 1, duration: 140});
  }

  async finish() {
    if (this.state === SectionState.INACTIVE ||
        this.state === SectionState.TEARING_DOWN) {
      return;
    }

    const main = document.querySelector('main') as HTMLElement;
    await fade(main, { from: 1, to: 0, duration: 140});

    this.state = SectionState.TEARING_DOWN;
    await this.teardown();

    // Check it's not been interrupted.
    if (this.state !== SectionState.TEARING_DOWN) {
      return;
    }
    this.state = SectionState.INACTIVE;
  }
}
