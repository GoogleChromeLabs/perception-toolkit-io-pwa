---
permalink: '/sitemap.xml'
---
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
{% for item in collections.all %}
  {% if item.url != "/sitemap.xml" %}
  <url>
    <loc>{{ env.origin }}{{ item.url }}</loc>
    <lastmod>{{ env.buildDate }}</lastmod>
  </url>
  {% endif %}
{% endfor %}
</urlset>
