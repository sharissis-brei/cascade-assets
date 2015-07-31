$(document).ready(function() {
  var $menu_toggle = $('#js-mobile-menu').unbind();
  $('#js-navigation-menu').removeClass("show");

  $menu_toggle.on('click', function(e) {
    e.preventDefault();
    $('#js-navigation-menu').slideToggle(function(){
      if($('#js-navigation-menu').is(':hidden')) {
        $('#js-navigation-menu').removeAttr('style');
      }
    });
  });

  $('li.nav-link.more').on('click', function(e) {
    if ($('#js-mobile-menu:visible').length) {
      // This is the mobile view
      e.preventDefault();
      $('li.nav-link.more.active').removeClass('active');
      $(this).addClass('active');
    }
  });
});
