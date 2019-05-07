---
layout: app.njk
title: 'Rotavo'
description: 'Sketchy app'
image: '/static/images/items/lighthouse.jpg'
expanded: true
header_text_color: '#252324'
header_background_color: '#FBBC06'
styles: 'details/details.css'
target: true
target_url: 'https://developers.google.com/web/tools/lighthouse'
---

<div id="header-block">
  <div id="header-block__titles">
    <h1>{{ title }}</h1>
    <h2>{{ description }}</h2>
  </div>

  ![{{ title }}]({{ image }})
</div>

<div id="details">
  <div id="controls">
    <button id="share">Share</button>
    <button id="delete">Delete</button>
  </div>

  <div id="description">Rotavo info</div>

  <ul>
    <li><a class="link" href="https://github.com/GoogleChrome/lighthouse">Open source project</a></li>
  </ul>
</div>
