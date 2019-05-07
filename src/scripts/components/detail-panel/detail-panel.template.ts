/**
 * @license
 * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

export const html = `
<div id="container">
  <slot></slot>
</div>
`;

export const styles = `
:host {
  display: block;
  width: 90%;
  height: 100%;
  margin: 0 auto;
  background: #FFF;
  border-radius: 20px 20px 0 0;
  box-shadow: 0 2px 1px rgba(0, 0, 0, 0.2);
  box-sizing: border-box;
  padding: 20px;
}
`;
