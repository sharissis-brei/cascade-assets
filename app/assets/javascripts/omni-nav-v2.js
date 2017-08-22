
var OmniNav2 = (function() {

  // Constants
  var TABLET_BREAKPOINT = 768; //px

  // Module Vars
  var $container,
      $utilityNav,
      $primaryNav;

  // Module Functions
  var initialize = function(container) {
    OffCanvasNav.init();
    $container = container;
    $utilityNav = $container.find('.utility-nav');
    $primaryNav = $container.find('#primary-nav');
    $('.utility-nav-trigger').on('click', onUtilityNavClick);
    $utilityNav.find('li.utility-has-dropdown').on('click', onUtilityNavDropdownClick);
    $utilityNav.find('input:text').on('input', onSearchInput);
    $primaryNav.find('input:text').on('input', onSearchInput);

    // Remove padding from theme version. Have to use js because css will not work.
    // See https://stackoverflow.com/a/1014958/6763239
    $('#theme header').css('padding-bottom', '0px');
  }

  var onUtilityNavClick = function() {
    $('.primary-nav-action').toggleClass("utility-open");

    if ($(window).width() >= TABLET_BREAKPOINT) {
      $utilityNav.toggleClass('utility-nav-open');
      $('html.omni-nav-v2').toggleClass('utility-nav-open');
      $primaryNav.removeClass('search-open');
    } else {
      $utilityNav.removeClass('utility-nav-open');
      $('html.omni-nav-v2').removeClass('utility-nav-open');
      $primaryNav.toggleClass('search-open');
    }

    var primaryNavClasses = document.getElementById('primary-nav').classList;

    // jQuery < 3.0 doesn't support toggleClass for SVGs
    // toggle open iff one of the search bars is open
    if (primaryNavClasses.contains("search-open") || $utilityNav.hasClass('utility-nav-open')) {
      $('.icon-open-search').attr("class", "icon-open-search hide");
      $('.icon-close-search').attr("class", "icon-close-search");
    } else {
      $('.icon-open-search').attr("class", "icon-open-search");
      $('.icon-close-search').attr("class", "icon-close-search hide");
    }
  };

  var onUtilityNavDropdownClick = function(e) {
    e.stopPropagation();
    $(this).siblings('.utility-has-dropdown').removeClass('dropdown-open');
    $(this).toggleClass('dropdown-open');
    $(document).on("click", onDocumentClick);
  };

  var onDocumentClick = function() {
    $('li.utility-has-dropdown').removeClass('dropdown-open');
    $(document).off("click", onDocumentClick);
  };

  var onSearchInput = function() {
    $('.search-icon').addClass('hide');
    $(document).on("click", function() {
      // resets search input box when user clicks outside
      $utilityNav.find('input:text').val("");
      $primaryNav.find('input:text').val("");
      $('.search-icon').removeClass('hide');
    });
  };


  var OffCanvasNav = (function() {

    // Module Vars
    var offCanvasLinks,
        resizeId;

    // Module Functions
    var initialize = function() {
      offCanvasLinks = $('#js-off-canvas-nav > ul > li > a');
      syncLinkWidths();

      $('#js-off-canvas-trigger, #js-close-off-canvas-nav, #js-off-canvas-overlay').on('click', function(event) {
        event.preventDefault();
        $('#js-off-canvas-nav-container').toggleClass('open');
        $('#js-off-canvas-overlay').toggleClass('active');
        $('body').toggleClass('no-scroll');
      });

      $('#js-off-canvas-nav-container .toggle').on('click', function() {
        $(this).parent().toggleClass('open'); // Targets li
        $(this).parent().find('ul').slideToggle();
      });

      $(window).on('resize', function() {
        clearTimeout(resizeId);
        resizeId = setTimeout(syncLinkWidths, 500);
      });
    };

    var syncLinkWidths = function() {
      var width = $('#js-off-canvas-nav > ul').width();
      offCanvasLinks.css('width', width);
    };

    return {
      init: initialize
    };
  })();

  return {
    init: initialize
  };
})();

$(document).ready(function () {
  OmniNav2.init($('#omni-nav-v2'));
});
