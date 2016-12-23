document.addEventListener("DOMContentLoaded", () => {

  let el = document.getElementById("htmlgl");

  let stage = new Stage({
    element: el // element to render
  });

  document.body.appendChild(stage.view);

  draw();
  function draw() {
    requestAnimationFrame(draw);
    let ctx = stage.getContext();
    stage.alpha = 0.5;
    stage.render();
  };

  window.addEventListener("resize", function() {
    var width = window.innerWidth;
    var height = window.innerHeight;
    stage.resize(width, height);
  });

});