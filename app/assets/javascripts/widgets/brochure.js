$(document).ready(function() {

  /*
  * menu button on masthead triggers the off-canvas nav to open
  */
  $(".offcanvas-menu-trigger a").on("click", function(){
    $("#js-cu-off-canvas-nav-trigger, #js-off-canvas-trigger").trigger("click");
    return false;
  });
});
