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

import { clamp } from './clamp.js';

function easeOut(value: number) {
  return 1 - Math.pow(1 - value, 3);
}

type Resolver = (value?: void | PromiseLike<void>) => void;

const animations = new WeakMap<HTMLElement, {id: number, resolve: Resolver}>();

/**
 * Fades an element using `requestAnimationFrame`. Takes a parameter detailing
 * the animation, which is an object containing `to` (`0 <= to <= 1`), `from`
 * (`0 <= to <= 1`), duration (milliseconds), and `ease` (a function that takes
 * a value between `0` and `1` and returns a new value, also between `0` and
 * `1`) properties.
 *
 * ```javascript
 * fade(someElement, { from: 1, to: 1, duration: 200, ease: (v) => v })
 * ```
 *
 * @param target The element to fade.
 */
export function fade(target: HTMLElement,
                     {from = 1,
                      to = 0,
                      delay = 0,
                      duration = 250,
                      ease = easeOut} = {}): Promise<void> {
  return new Promise((resolve) => {
    const existingAnimation = animations.get(target);
    if (existingAnimation) {
      cancelAnimationFrame(existingAnimation.id);
      animations.delete(target);
      existingAnimation.resolve();
    }

    target.style.opacity = from.toString();
    const start = self.performance.now() + delay;
    const update = () => {
      const now = self.performance.now();
      const time = clamp((now - start) / duration, 0, 1);
      const value = from + ((to - from) * ease(time));

      target.style.opacity = value.toString();

      if (time < 1) {
        animations.set(target, {id: requestAnimationFrame(update), resolve});
      } else {
        target.style.opacity = to.toString();
        animations.delete(target);
        resolve();
      }
    };

    animations.set(target, {id: requestAnimationFrame(update), resolve});
  });
}
