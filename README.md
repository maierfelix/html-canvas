# Render HTML elements into canvas

A small experiment about rendering html elements into a canvas node.
You have full control about drawing, alpha channel, fps and can even apply filters and element events (e.g onClick).

Use developer tools to change the content of the ``<htmlgl>`` in realtime. This is made possible by the new mutation observer api, which allows to easily track changes on dom nodes.

Files:
 - index.html contains an ``<htmlgl>`` code section
 - main.js showcase of the renderer api
 - renderer.js contains the actual html renderer and rasterizer
