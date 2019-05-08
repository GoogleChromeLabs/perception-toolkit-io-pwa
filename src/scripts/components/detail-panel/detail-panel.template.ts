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
