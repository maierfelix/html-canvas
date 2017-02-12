document.addEventListener("DOMContentLoaded", () => {

  let el = document.getElementById("htmlgl");

  let stage = new HTMLRenderer({
    alpha: 0.25, // base alpha
    element: el // element to render
  });

  document.body.appendChild(stage.view);

  draw();
  function draw() {
    requestAnimationFrame(draw);
    let ctx = stage.getContext();
    stage.alpha += 0.01;
    stage.render();
  };

  window.addEventListener("resize", () => {
    let width = window.innerWidth;
    let height = window.innerHeight;
    stage.resize(width, height);
  });

  window.addEventListener("mousewheel", (e) => {
    let x = e.deltaY > 0 ? -0.1 : 0.1;
    stage.scale += x;
  });

});