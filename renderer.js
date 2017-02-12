const PIXEL_RATIO = (() => {
  let ctx = document.createElement("canvas").getContext("2d");
  let dpr = window.devicePixelRatio || 1;
  let bsr = (
    ctx.webkitBackingStorePixelRatio ||
    ctx.mozBackingStorePixelRatio ||
    ctx.msBackingStorePixelRatio ||
    ctx.oBackingStorePixelRatio ||
    ctx.backingStorePixelRatio || 1
  );
  let ratio = dpr / bsr;
  return (ratio);
})();

class HTMLRenderer {

  constructor(obj) {
    obj = obj || {};
    this.ctx = null;
    this._alpha = obj.alpha !== void 0 ? obj.alpha : 1;
    this._scale = obj.scale !== void 0 ? obj.scale : 1;
    this.content = null;
    this.view = null;
    this.element = obj.element;
    this.redrawing = false;
    this.width = obj.width || window.innerWidth;
    this.height = obj.height || window.innerHeight;
    if (!obj.element) throw new Error("Invalid element!");
    // make sure the hidden source stays invisible
    obj.element.style.opacity = 0;
    this.setupView();
    this.redrawElement();
    this.watchElement();
    return (this);
  }

  get alpha() {
    return (this._alpha);
  }
  set alpha(x) {
    this._alpha = x;
  }

  get scale() {
    return (this._scale);
  }
  set scale(x) {
    this._scale = x;
  }

  rasterize(html, ctx, resolve) {
    let width = ctx.canvas.width;
    let height = ctx.canvas.height;
    let data = `
      <svg xmlns='http://www.w3.org/2000/svg' width='${width/PIXEL_RATIO}' height='${height/PIXEL_RATIO}'>
        <foreignObject width='${100/PIXEL_RATIO}%' height='${100/PIXEL_RATIO}%' externalResourcesRequired='true'>
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
  }

  updateContext(ctx, width, height) {
    let canvas = ctx.canvas;
    canvas.width = width * PIXEL_RATIO;
    canvas.height = height * PIXEL_RATIO;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    ctx.imageSmoothingEnabled = true;
    ctx.webkitImageSmoothingEnabled = true;
    ctx.setTransform(PIXEL_RATIO, 0, 0, PIXEL_RATIO, 0, 0);
  }

  createCanvas() {
    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");
    this.updateContext(ctx, this.width, this.height);
    return (ctx);
  }

  setupView() {
    let ctx = this.createCanvas();
    this.ctx = ctx;
    this.view = ctx.canvas;
    this.resize(this.width, this.height);
  }

  watchElement() {
    let observer = new MutationObserver((mutations) => {
      this.redrawElement();
    });
    let config = {
      subtree: true,
      childList: true,
      attributes: true,
      characterData: true
    };
    observer.observe(this.element, config);
  }

  redrawElement(resolve) {
    this.redrawing = true;
    console.log("Redraw!");
    this.redraw((buffer) => {
      this.content = buffer;
      this.redrawing = false;
      if (resolve instanceof Function) resolve();
    });
  }

  redraw(resolve) {
    let html = this.element.innerHTML;
    this.rasterize(html, this.ctx, (buffer) => {
      resolve(buffer);
    });
  }

  clear() {
    this.ctx.clearRect(
      0, 0,
      this.width, this.height
    );
  }

  getContext() {
    return (this.ctx);
  }

  resize(width, height) {
    this.width = width;
    this.height = height;
    this.updateContext(this.ctx, width*PIXEL_RATIO, height*PIXEL_RATIO);
    if (this.content !== null) this.draw(this.content);
    this.redrawElement();
  }

  draw(buffer) {
    let ctx = this.ctx;
    let scale = this._scale;
    let width = this.width;
    let height = this.height;
    ctx.globalAlpha = this._alpha;
    ctx.drawImage(
      buffer,
      0, 0,
      width|0, height|0,
      0, 0,
      (width * scale)|0, (height * scale)|0
    );
  }

  render() {
    if (this.redrawing === false) {
      this.clear();
      this.draw(this.content);
    }
  }

};