var OmniNav2 = (function() {

  // Constants
  var TABLET_BREAKPOINT = 768; //px
  var DESKTOP_BREAKPOINT = 1300; //px
  var OMNINAV_BASE_HEIGHT = 60; //px

  // Module Vars
  var $container,
      $utilityNav,
      $primaryNav,
      searchAPI;

  // Module Functions
  var initialize = function(container) {
    // Key DOM elements.
    $container = container;
    $utilityNav = $container.find('.utility-nav');
    $primaryNav = $container.find('#primary-nav');
    // Mark OmniNav v2 presence on page.
    $('html').addClass('omni-nav-v2');

    // Initialize submodules.
    OffCanvasNav.init();
    MobileNav.init();

    var omniNavId = $container.attr('id'),
        primarySearchId = 'primary-nav-search',
        utilitySearchId = 'utility-nav-search';

    /*
     * We only initialize one form based on window size. This reduces the number
     * of accessibility errors/alerts caused by Google Custom search code that
     * we can't change.
     */
    if ($(window).width() >= TABLET_BREAKPOINT) {
      searchAPI = GoogleCustomSearch.init(omniNavId, utilitySearchId);
    }
    else {
      searchAPI = GoogleCustomSearch.init(omniNavId, primarySearchId);
    }

    applyStyleAdjustments();
    bindEventHandlers();
  };

  var applyStyleAdjustments = function() {
    // Remove padding from theme version. Have to use js because css will not work.
    // See https://stackoverflow.com/a/1014958/6763239
    $('#theme header').css('padding-bottom', '0px');

    // Removes space between mastheads and omninav
    $('.bigMasthead').find('header').css('margin-top', '0px');
    $('.bigMasthead').find('header').css('margin-bottom', '0px');

    // Functions for anchor points in certain widgets
    var height = getOmninavHeight();
    var params = getUrlParams();
    repositionForPersonnelAnchor(params, height);
    repositionForTabAnchor(params, height);
    repositionForCollabsibleAnchor(params, height);
  };

  var bindEventHandlers = function() {
    $('.utility-nav-trigger').on('click', onUtilityNavClick);
    $utilityNav.find('li.utility-has-dropdown').on('click', onUtilityNavDropdownClick);

    var hideSearchResultsTimeoutId = null;
    $(window).on('resize', function() {
      clearTimeout(hideSearchResultsTimeoutId);
      hideSearchResultsTimeoutId = setTimeout(hideSearchResults, 250);
    });
  };

  var hideSearchResults = function() {
    if ( searchAPI.isOpen() ) {
      searchAPI.hideResults();
    }
  };

  var getOmninavHeight = function() {
    // Primary Nav
    // The primary nav will always show, this is the minimum
    var height = OMNINAV_BASE_HEIGHT;

    // On mobile screen, omninav is always just primary nav
    if ( $(window).width() < TABLET_BREAKPOINT ) {
      return height;
    }

    // Global Nav
    // Always stacked on tablet, so should be primary nav + global nav height
    var isTabletSize = ($(window).width() >= TABLET_BREAKPOINT) && ($(window).width() < DESKTOP_BREAKPOINT);
    if ( isTabletSize) {
      height += OMNINAV_BASE_HEIGHT;
    }

    // By default when you load the page for the first time, the utility nav is closed
    // so its height will never need to be accounted for in this case
    return height;
  };

  var getUrlParams = function() {
    // ex. ?openregion=1
    var searchString = window.location.search.substring(1);
    //ex. #john-doe
    var anchorName = window.location.hash;

    if ( searchString.indexOf('=') > -1 ) {
      var urlParams = {};
      var e,
      a = /\+/g,  // Regex for replacing addition symbol with a space
      r = /([^&=]+)=?([^&]*)/g,
      d = function (s) { return decodeURIComponent(s.replace(a, " ")); },
      q = window.location.search.substring(1);

      while (e = r.exec(q)) urlParams[d(e[1])] = d(e[2]);
      return urlParams;
    }
    else {
      return anchorName;
    }
  };

  var repositionForCollabsibleAnchor = function(urlParams, omninavHeight) {
    /* Used with the Collapsible Region widget */
    if ((urlParams["openregion"] != undefined) &&
        (urlParams["openregion"] == parseInt(urlParams["openregion"])) &&
        (urlParams["openregion"] - 1 < $(".collapsibles-widget .accordion").length)) {

      // Offset for zero based arrays
      if (urlParams["openregion"] != 0)
          urlParams["openregion"] = urlParams["openregion"] - 1;

      var $activeElementRegion = $(".collapsibles-widget .accordion").eq(urlParams["openregion"]);

      // Add the active class to nth accordion and remove all other active classes
      $activeElementRegion.addClass("active").siblings().removeClass("active");

      // Display the current region
      $activeElementRegion.find("div.collapsibles-widget").show();

      // Hide the other regions
      $activeElementRegion.siblings().find("div.content").hide();

      // Scroll to the active element (add offset for omninav height)
      setTimeout(function(){
        $('html, body').stop().animate({
          scrollTop:$activeElementRegion.offset().top - omninavHeight
        },1000);
      },250);
    }
  };

  var repositionForTabAnchor = function(urlParams, omninavHeight) {
    /* Used with the Tab widget */
    if ((urlParams["startingtab"] != undefined) &&
        (urlParams["startingtab"] == parseInt(urlParams["startingtab"])) &&
        (urlParams["startingtab"] - 1 < $(".main .tabs-nav li").length)) {

      // Offset for zero based arrays
      if (urlParams["startingtab"] != 0)
          urlParams["startingtab"] = urlParams["startingtab"] - 1;

      var $activeElementTab = $(".main .tabs-nav li").eq(urlParams["startingtab"]);

      // Set active class
      $activeElementTab.addClass("active").siblings().removeClass("active");

      // Update the content section - set active content to display
      $activeElementTab.parent().siblings().children("li:eq(" + urlParams["startingtab"] + ")").addClass("active").siblings().removeClass("active");

      // Scroll to the active element (add offset for omninav height)
      setTimeout(function(){
        $('html, body').stop().animate({
          scrollTop:$activeElementTab.offset().top - omninavHeight
        },1000);
      },250);
    }
  };

  var repositionForPersonnelAnchor = function(urlHash, omninavHeight) {
    // Unfortunately, there isn't a uniform identifier that can be referenced throughout
    // the site at this time. So we have to cover a few cases.
    var $wysiwygLinks = $('h3.anchorLinks a, a[href="#top"]');
    var $azLinks = $('div.a-z-widget a');

    // Callback to reposition anchors on click.
    var repositionAnchorsOnClick = function(e) {
      // Pull anchor identifer from URL hash.
      var anchorIdentifer = this.hash.slice(1);

      // Identify target element. It could be a name or id attr.
      var nameSelector = 'a[name=' + anchorIdentifer + ']';
      var idSelector = '#' + anchorIdentifer;

      // Look first for name selector.
      var $target = $(nameSelector);

      // If no name selector, look for ID selector.
      if (!$target.length) {
        $target = $(idSelector);
      }

      if ( $target.length ) {
        e.preventDefault();
        var newTopPosition = $target.offset().top - omninavHeight;

        setTimeout(function(){
          $('html, body').stop().animate({scrollTop: newTopPosition}, 1000);
        },250);
      }
    };

    // Scrolls down if there is a hash initially in the current page URL
    var repositionAnchorsFromUrl = function() {
      // Pull anchor identifer from URL hash.
      var anchorIdentifer = urlHash.slice(1);

      // There will only be an anchorIdentifier for url with hash identifier. (e.g.
      // https://chapman.edu/#container. If no hash, return.)
      if ( !anchorIdentifer ) {
        return;
      }

      // Identify target element. It could be a name or id attr.
      var nameSelector = 'a[name=' + anchorIdentifer + ']';
      var idSelector = '#' + anchorIdentifer;

      // Look first for name selector.
      // anchorIdentifier could lead to an invalid jQuery selector so wrap in a
      // try/catch. For details, see https://github.com/chapmanu/cascade-assets/issues/295.
      try {
        var $target = $(nameSelector);
      }
      catch(error) {
        return false;
      }

      // If no name selector, look for ID selector.
      if ( !$target.length ) {
        $target = $(idSelector);
      }

      // If target for anchorIdentifer not found, we can return or else we'll get an
      // error in animate code below.
      if ( !$target.length ) {
        return;
      }

      setTimeout(function(){
        $('html, body').stop().animate({
          scrollTop: $target.offset().top - omninavHeight
        }, 1000);
      }, 250);
    };

    if (typeof urlHash === 'string') repositionAnchorsFromUrl();
    $wysiwygLinks.on('click', repositionAnchorsOnClick);
    $azLinks.on('click', repositionAnchorsOnClick);
  };

  var onUtilityNavClick = function() {
    // Set gradual transition for padding adjustments after initial load
    // Timing and duration match slideToggle defaults
    $('html.omni-nav-v2').css('transition', 'padding-top 400ms ease-in-out');
    $('.primary-nav-action').toggleClass("utility-open");

    if ($(window).width() >= DESKTOP_BREAKPOINT) {
      // slideToggle() sets display: block and overflow: hidden by default
      // utility-nav-container needs to be table-cell, and all utility-nav divs need overflow: visible
      $utilityNav.find('.utility-nav-container').slideToggle(10, function() {
        $(this).css('display', 'table-cell');
        $(this).css('overflow', 'visible');
      });

      // Main utility-nav div
      $utilityNav.toggleClass('utility-nav-open').slideToggle(function() {
        $(this).css('overflow', 'visible');
      });

      // Other utility nav trigger classes
      $('html.omni-nav-v2').toggleClass('utility-nav-open');
      $primaryNav.removeClass('search-open');

      // Sets focus on search input field, if utility nav is being opened
      if ($('.utility-nav-open').length > 0) {
        // Focus needs a slight delay to allow the utility nav to come down all the way
        setTimeout(function(){
          $('#utility-nav-search').find('.cu-search-box').find('input.gsc-input').focus();
        },300);
      }
    }
    else if ( $(window).width() >= TABLET_BREAKPOINT && $(window).width() < DESKTOP_BREAKPOINT ) {
      // On tablet, utility-links don't show, only utility-search should toggle in container
      $utilityNav.find('.utility-nav-container.utility-search').slideToggle(10, function() {
        $(this).css('display', 'table-cell');
        $(this).css('overflow', 'visible');
      });

      // Make sure utility-links doesn't still have display: table-cell
      $utilityNav.find('.utility-nav-container.utility-links').css('display', 'none');
      // Main utility-nav div
      $utilityNav.toggleClass('utility-nav-open').slideToggle(function() {
        $(this).css('overflow', 'visible');
      });

      // Other utility nav trigger classes
      $('html.omni-nav-v2').toggleClass('utility-nav-open');
      $primaryNav.removeClass('search-open');

      // Sets focus on search input field, if utility nav is being opened
      if ($('.utility-nav-open').length > 0) {
        // Focus needs a slight delay to allow the utility nav to come down all the way
        setTimeout(function(){
          $('#utility-nav-search').find('.cu-search-box').find('input.gsc-input').focus();
        },300);
      }
    }
    else {
      $utilityNav.removeClass('utility-nav-open');
      $('html.omni-nav-v2').removeClass('utility-nav-open');
      $primaryNav.toggleClass('search-open');
      // Sets focus for search input field
      if ($('.search-open').length > 0) $('#primary-nav-search').find('.cu-search-box').find('input.gsc-input').focus();
    }


    var primaryNavClasses = document.getElementById('primary-nav').classList;

    // jQuery < 3.0 doesn't support addClass/removeClass for SVGs
    // See Stack Overflow question: https://stackoverflow.com/questions/8638621/jquery-svg-why-cant-i-addclass
    if (primaryNavClasses.contains("search-open") || $utilityNav.hasClass('utility-nav-open')) {
      // Toggle open iff one of the search bars is open
      $('.icon-open-search').attr("class", "icon-open-search hide");
      $('.icon-close-search').attr("class", "icon-close-search");
    } else {
      $('.icon-open-search').attr("class", "icon-open-search");
      $('.icon-close-search').attr("class", "icon-close-search hide");
    }
  };

  var onUtilityNavDropdownClick = function(e) {
    e.stopPropagation();

    // This is to prevent Search From and Social dropdowns from overlapping
    // Search From (.search-type) has a different parent than the other dropdowns so it needs a different selector to hide the other dropdowns
    if ( $(this)[0].classList.contains('search-type') ) {
      $('.utility-links').find('.utility-has-dropdown').removeClass('dropdown-open');
    }
    else {
      $(this).siblings('.utility-has-dropdown').removeClass('dropdown-open');
      $('.utility-search').find('.utility-has-dropdown').removeClass('dropdown-open');
    }

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

  // This module handles functionality associated with OffCanvasNav in particular.
  var OffCanvasNav = (function() {

    // Module Vars
    var $offCanvasLinks;

    // Module Functions
    var initialize = function() {
      $offCanvasLinks = $('#js-off-canvas-nav > ul > li > a');
      syncLinkWidths();
      bindEventHandlers();
    };

    var syncLinkWidths = function() {
      var width = $('#js-off-canvas-nav > ul').width();
      $offCanvasLinks.css('width', width);
    };

    var bindEventHandlers = function() {
      enableMenusToggle();
      enableOffCanvasNavHandlers();

      var syncLinkWidthsTimeoutId;
      $(window).on('resize', function() {
        clearTimeout(syncLinkWidthsTimeoutId);
        syncLinkWidthsTimeoutId = setTimeout(syncLinkWidths, 500);
      });
    };

    var enableMenusToggle = function() {
      // Enables toggle to slide main/umbrella menus back and forth.
      $('a.toggle-menu-label').on('click', function(e) {
        // Toggles headers.
        $('div#umbrella-logo').toggle('blind');

        // Slide-toggles the menus.
        $('div#off-canvas-umbrella').toggle('slide');
      });
    };

    var enableOffCanvasNavHandlers = function() {
      // Selector for close-off-canvas can't be an ID because branded pages have it in 2 places
      // SiteImprove reports duplicate IDs
      var offCanvasSelectors = '#js-off-canvas-trigger, .js-close-off-canvas-nav, #js-off-canvas-overlay';

      $(offCanvasSelectors).on('click', function(event) {
        event.preventDefault();
        $('#js-off-canvas-nav-container').toggleClass('open');
        $('#js-off-canvas-overlay').toggleClass('active');
        $('body').toggleClass('no-scroll');
      });

      $('#js-off-canvas-nav-container .toggle').on('click', function() {
        $(this).parent().toggleClass('open'); // Targets li
        $(this).parent().find('ul').slideToggle();
      });
    };

    return {
      init: initialize
    };
  })();

  // Module for Navigate This Section button on mobile
  var MobileNav = (function() {
    // Module Vars
    var $navThisSectionButton,
        $leftNavMenu,
        $omniNavHeight;

    // Module Functions
    var initialize = function() {
      $navThisSectionButton = $('div#mobile-nav > a.button');
      $leftNavMenu = $('.leftNav > .leftTitle');
      $omniNavHeight = getOmninavHeight();

      $navThisSectionButton.on('click', scrollToLeftNavOnButtonClick);
    };

    var scrollToLeftNavOnButtonClick = function() {
      // OmniNav is fixed position. I'd expect this to be:
      // $leftNavMenu.offset().top + omniNavHeight
      // But testing proved otherwise.
      var scrollTo = $leftNavMenu.offset().top - $omniNavHeight;

      // I really wish we had used a plugin like scrollTo or scrollable. I'm
      // seeing various other approaches to scrolling elsewhere in code base so
      // I'm reluctanct to introduce a plugin now.
      // Source for this approach: https://stackoverflow.com/a/6677069/6763239
      $('html, body').animate({
        scrollTop: scrollTo
      }, 'slow');
    };

    return {
      init: initialize
    };
  })();
  // Return for OmniNav2 module
  return {
    init: initialize
  };
})();

$(document).ready(function () {
  //prevent conflicts with omni-nav-v1
  if($('#omni-nav-v2').length) {
    OmniNav2.init($('#omni-nav-v2'));
  }
});
