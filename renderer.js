function cloneCanvas(old) {
  let canvas = document.createElement("canvas");
  canvas.width = old.width;
  canvas.height = old.height;
  canvas.getContext("2d").drawImage(
    old,
    0, 0,
    old.width, old.height,
    0, 0,
    old.width, old.height
  );
  return (canvas);
};

class Stage {
  constructor(obj) {
    obj = obj || {};
    this.ctx = null;
    this._alpha = 1;
    this._scale = 1;
    this.content = null;
    this.watch = null;
    this.view = null;
    this.element = obj.element;
    this.redrawing = false;
    this.width = obj.width || window.innerWidth;
    this.height = obj.height || window.innerHeight;
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
  }

  setupView() {
    this.view = document.createElement("canvas");
    this.ctx = this.view.getContext("2d");
    this.view.width = this.width;
    this.view.height = this.height;
    this.resize(this.view.width, this.view.height);
  }

  watchElement() {
    let watch = new Watcher(this.element, {}, (e) => {
      this.redrawElement();
    });
    watch.start();
    this.watch = watch;
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
    this.view.width = width;
    this.view.height = height;
    // immediately draw old state again
    // to avoid white screen flickering
    this.clear();
    if (this.content !== null) this.draw(this.content);
    this.redrawElement();
  }

  draw(buffer) {
    let ctx = this.ctx;
    let width = this.width;
    let height = this.height;
    ctx.globalAlpha = this._alpha;
    this.ctx.drawImage(
      buffer,
      0, 0,
      width, height,
      0, 0,
      width * this._scale, height * this._scale
    );
  }

  render() {
    if (this.redrawing === false) {
      this.clear();
      this.draw(this.content);
    }
  }

};