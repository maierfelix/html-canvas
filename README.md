# Render HTML elements into canvas

A small experiment about rendering html elements into a canvas node.
You have full control about redrawing, alpha channel, fps and can even apply canvas filters and element events (e.g onClick).

Use developer tools to change the content of the ``<htmlgl>`` in realtime. This is made possible by the new element observers, which allow you to easily track changes on elements.

Due to security reasons it's not possible to render images without much hax, so this part is just left out.

Files:
 - index.html contains an example ``<htmlgl>`` code section
 - main.js demonstrates the renderer api
 - container.js contains the actual html renderer
 - rasterize.js embeds html into an image encoded svg

Libraries:
 - watcher.min.js track element changes
 - stats.js fps measuring etc.