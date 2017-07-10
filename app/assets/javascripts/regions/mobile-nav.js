/*
 * Scroll to Left Navigation menu in Mobile view.
 */
var MobileNav = (function() {
  // Public Methods
  var scrollToLeftNavOnButtonClick = function() {
    var $navThisSectionButton = $('div#mobile-nav > a.button');
    var $leftNavMenu = $('.leftNav > .leftTitle');
    var omniNavHeight = $('#cu_nav').outerHeight(true);

    $navThisSectionButton.on('click', function() {
      // OmniNav is fixed position. I'd expect this to be:
      // $leftNavMenu.offset().top + omniNavHeight
      // But testing proved otherwise.
      var scrollTo = $leftNavMenu.offset().top - omniNavHeight;

      // I really wish we had used a plugin like scrollTo or scrollable. I'm
      // seeing various other approaches to scrolling elsewhere in code base so
      // I'm reluctanct to introduce a plugin now.
      // Source for this approach: https://stackoverflow.com/a/6677069/6763239
      $('html, body').animate({
        scrollTop: scrollTo
      }, 'slow');
    });
  };

  // Private Methods

  // Public API
  return {
    scrollToLeftNavOnButtonClick: scrollToLeftNavOnButtonClick
  };
})();


// On document ready.
$(function () {
  MobileNav.scrollToLeftNavOnButtonClick();
});
