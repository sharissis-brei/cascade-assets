$(document).ready(function(){
  var $anchorLinks = $('h3.anchorLinks a, a[href="#top"]');
  var navHeight = $("#cu_nav").outerHeight();

  /* offset omninav when interal anchor links scroll to target */
  $anchorLinks.on('click', function(e){
    // target anchor to scroll to is identified by name attribute
    var $target = $('a[name=' + this.hash.slice(1) + ']');

    if($target.length) {
      e.preventDefault();
      $("body, html").animate({scrollTop: $target.offset().top - navHeight});
    }
  });
});