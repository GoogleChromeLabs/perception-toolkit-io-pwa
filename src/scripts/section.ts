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
