# Render HTML elements into canvas

A small experiment about rendering html nodes inside a canvas.
You have full control about drawing, alpha channel, fps and can even apply filters and element events (e.g onClick).

Use developer tools to change the content of the ``<htmlgl>`` in realtime. This is made possible by the mutation observer api, which allows to track changes on dom nodes.

Files:
 - index.html contains an ``<htmlcanvas>`` code section
 - main.js showcase of the renderer api
 - renderer.js contains the actual html renderer and rasterizer
