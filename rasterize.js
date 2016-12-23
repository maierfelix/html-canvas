let DOMURL = window.URL || window.webkitURL || window;

let type = {
  type: "image/svg+xml"
};

let rasterize = (html, ctx, resolve) => {
  let width = ctx.canvas.width;
  let height = ctx.canvas.height;

  let data = `
    <svg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}'>
      <foreignObject width='100%' height='100%' externalResourcesRequired='true'>
        <div xmlns='http://www.w3.org/1999/xhtml'>
          ${html}
        </div>
      </foreignObject>
    </svg>
  `;

  data = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(data);

  let img = new Image();
  img.addEventListener("load", () => {
    resolve(img);
  });
  img.src = data;

};