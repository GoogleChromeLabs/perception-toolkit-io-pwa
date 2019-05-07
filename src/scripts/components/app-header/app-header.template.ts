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
  <div id="background"></div>
  <a id="home" href="/">Home</a>
  <div id="slotted"><slot></slot></div>
  <a id="capture" href="/capture/">Capture</a>
  <a id="list" href="/list/">List</a>
`;

export const styles = `
:host {
  --header-background-color: #111;
  --header-text-color: #FFF;

  display: flex;
  height: 64px;
  justify-content: center;
  position: relative;
  z-index: 1;
  box-sizing: border-box;
  padding: 20px 24px;
  transition: opacity 0.25s cubic-bezier(0, 0, 0.3, 1);
}

:host(.visible) {
  opacity: 1 !important;
}

:host(.visible)::after {
  display: none !important;
}

#home, #capture, #list {
  display: block;
  z-index: 1;
  width: 24px;
  height: 24px;
  margin-right: 12px;
  transition: opacity 0.1s cubic-bezier(0, 0, 0.3, 1);
  cursor: pointer;
}

#home {
  background: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d` +
    `3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0Jve` +
    `D0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSIjMzMzIiBkPSJNMTAgMjB2LTZoNHY2aDV` +
    `2LThoM0wxMiAzIDIgMTJoM3Y4eiIvPjxwYXRoIGQ9Ik0wIDBoMjR2MjRIMHoiIGZpb` +
    `Gw9Im5vbmUiLz48L3N2Zz4K);
  pointer-events: none;
  opacity: 0;
}

#capture {
  background: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d` +
    `3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0Jve` +
    `D0iMCAwIDI0IDI0Ij48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIzLjIiLz48cGF` +
    `0aCBmaWxsPSIjMzMzIiBkPSJNOSAyTDcuMTcgNEg0Yy0xLjEgMC0yIC45LTIgMnYxM` +
    `mMwIDEuMS45IDIgMiAyaDE2YzEuMSAwIDItLjkgMi0yVjZjMC0xLjEtLjktMi0yLTJ` +
    `oLTMuMTdMMTUgMkg5em0zIDE1Yy0yLjc2IDAtNS0yLjI0LTUtNXMyLjI0LTUgNS01I` +
    `DUgMi4yNCA1IDUtMi4yNCA1LTUgNXoiLz48cGF0aCBkPSJNMCAwaDI0djI0SDB6IiB` +
    `maWxsPSJub25lIi8+PC9zdmc+Cg==);
  pointer-events: none;
  opacity: 0;
  position: absolute;
  right: 12px;
  top: 20px;
}

#list {
  background: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d` +
    `3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0Jve` +
    `D0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSIjMzMzIiBkPSJNNCAxNGg0di00SDR2NHp` +
    `tMCA1aDR2LTRINHY0ek00IDloNFY1SDR2NHptNSA1aDEydi00SDl2NHptMCA1aDEyd` +
    `i00SDl2NHpNOSA1djRoMTJWNUg5eiIvPjxwYXRoIGQ9Ik0wIDBoMjR2MjRIMHoiIGZ` +
    `pbGw9Im5vbmUiLz48L3N2Zz4K);
  pointer-events: auto;
  opacity: 1;
  position: absolute;
  right: 12px;
  top: 20px;
}

:host(.home-available) #home {
  pointer-events: auto;
  opacity: 1;
  transition: opacity 0.2s cubic-bezier(0, 0, 0.3, 1) 0.1s;
}

:host(.capture-available) #capture {
  pointer-events: auto;
  opacity: 1;
}

:host(.capture-available) #list {
  pointer-events: none;
  opacity: 0;
}

#background {
  height: 64px;
  background-color: var(--header-background-color);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  transform-origin: 0 0;
  transition: background-color 0.2s cubic-bezier(0, 0, 0.3, 1),
      transform 0.2s cubic-bezier(0, 0, 0.3, 1);
  z-index: 0;
}

:host(.expanded) {
  height: 302px;
  z-index: 0;
}

:host(.expanded) #background {
  transform: scaleY(4.72);
}

#slotted {
  position: relative;
  color: var(--header-text-color);
  z-index: 1;
  font-size: 18px;
  flex: 1;
  text-align: left;
  transform: translateX(-36px);
  transition: transform 0.2s cubic-bezier(0, 0, 0.3, 1);
}

:host(.home-available) #slotted {
  transform: none;
}
`;
