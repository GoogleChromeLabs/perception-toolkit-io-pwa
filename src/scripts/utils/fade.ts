
/**
 * @license
 * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
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
