$(document).ready(function() {
  $(".offcanvas-menu-trigger a").on("click", function(){
    $("#js-cu-off-canvas-nav-trigger").trigger("click");
    return false;
  })
});