---
layout: app.njk
title: 'web.dev'
description: 'Powered by Lighthouse'
image: '/static/images/items/web.dev.jpg'
expanded: true
header_text_color: '#252324'
header_background_color: '#FBBC06'
styles: 'details/details.css'
target: true
target_url: 'https://web.dev/'
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

  <div id="description">
    <p>Whether you already have a website or you're just getting started, learn to build for the modern web at web.dev, powered by Lighthouse, our automated web page audit tool.</p>
    <p>After you've launched your site, come back to <a href="{{ target_url }}">web.dev</a> and measure how well it supports your users. If there are areas where it can improve, you'll get immediate steps to increase your metrics.</p>
  </div>

  <ul>
    <li><a class="link" href="https://web.dev/">Sign up for the newsletter</a></li>
  </ul>
</div>
