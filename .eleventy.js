/**
 * @license
 * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

const CleanCSS = require('clean-css');

module.exports = function(eleventyConfig) {
  eleventyConfig.setTemplateFormats('md,js,json');
  eleventyConfig.addFilter('cssmin', (code) => {
    return new CleanCSS({}).minify(code).styles;
  });

  eleventyConfig.addPassthroughCopy(
      'node_modules/@webcomponents/webcomponentsjs/webcomponents-loader.js');
  eleventyConfig.addPassthroughCopy(
      'node_modules/perception-toolkit/lib');
  eleventyConfig.addPassthroughCopy(
    'node_modules/perception-toolkit/third_party');
  eleventyConfig.addPassthroughCopy(
    'node_modules/idb-keyval/dist/idb-keyval-iife.min.js');
  eleventyConfig.addPassthroughCopy('src/static');
  eleventyConfig.addPassthroughCopy('bundled');

  return {
    passthroughFileCopy: true
  };
}
