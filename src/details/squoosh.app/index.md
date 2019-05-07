---
layout: app.njk
title: 'Squoosh.app'
description: 'Image Compression Made Easy'
image: '/static/images/items/squoosh.app.jpg'
expanded: true
header_text_color: '#252324'
header_background_color: '#FBBC06'
styles: 'details/details.css'
target: true
target_url: 'https://squoosh.app'
---

<div id="header-block">
  <div id="header-block__titles">
    <h1>{{ title }}</h1>
    <h2>{{ description }}</h2>
  </div>

  ![Squoosh.app]({{ image }})
</div>

<div id="details">
  <div id="controls">
    <button id="share">Share</button>
    <button id="delete">Delete</button>
  </div>

  <div id="description">Squoosh is a powerful image compression tool that launches almost instantly, and then manages a smooth UI even when it’s doing heavy work, including using Web Assembly to do more with codecs the browser doesn’t have baked in.</div>

  <ul>
    <li><a class="link" href="https://squoosh.app/">Launch squoosh.app</a></li>
    <li><a class="link" href="https://blog.chromium.org/2018/11/chrome-dev-summit-2018-building-faster.html">Squoosh launch blog post</a></li>
  </ul>
</div>
