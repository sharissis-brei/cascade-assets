var OmniNav2 = (function() {

  // Constants
  var TABLET_BREAKPOINT = 768; //px
  var DESKTOP_BREAKPOINT = 1300; //px
  var OMNINAV_BASE_HEIGHT = 60; //px

  // Module Vars
  var $container,
      $utilityNav,
      $primaryNav;

  // Module Functions
  var initialize = function(container) {
    GoogleCustomSearch.init();
    OffCanvasNav.init();
    MobileNav.init();
    $container = container;
    $utilityNav = $container.find('.utility-nav');
    $primaryNav = $container.find('#primary-nav');
    $('html').addClass('omni-nav-v2');
    $('.utility-nav-trigger').on('click', onUtilityNavClick);
    $utilityNav.find('li.utility-has-dropdown').on('click', onUtilityNavDropdownClick);

    // Remove padding from theme version. Have to use js because css will not work.
    // See https://stackoverflow.com/a/1014958/6763239
    $('#theme header').css('padding-bottom', '0px');

    // Removes space between mastheads and omninav
    // Only applicable to omninav v2
    $('.bigMasthead').find('header').css('margin-top', '0px');
    $('.bigMasthead').find('header').css('margin-bottom', '0px');

    // Functions for anchor points in certain widgets
    var height = getOmninavHeight();
    var params = getUrlParams();
    repositionForPersonnelAnchor(params, height);
    repositionForTabAnchor(params, height);
    repositionForCollabsibleAnchor(params, height);
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

      // Identify target element. It could be a name or id attr.
      var nameSelector = 'a[name=' + anchorIdentifer + ']';
      var idSelector = '#' + anchorIdentifer;

      // Look first for name selector.
      var $target = $(nameSelector);

      // If no name selector, look for ID selector.
      if (!$target.length) {
        $target = $(idSelector);
      }

      setTimeout(function(){
        $('html, body').stop().animate({
          scrollTop:$target.offset().top - omninavHeight
        },1000);
      },250);
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
          $('#gsc-i-id1').focus();
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
          $('#gsc-i-id1').focus();
        },300);
      }
    }
    else {
      $utilityNav.removeClass('utility-nav-open');
      $('html.omni-nav-v2').removeClass('utility-nav-open');
      $primaryNav.toggleClass('search-open');
      // Sets focus for search input field
      if ($('.search-open').length > 0) $('#gsc-i-id2').focus();
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

  var GoogleCustomSearch = (function() {
    var GCS_ENGINE_ID = '015856566681218627934:2ndbiubovo4';
    var GCS_SOURCE = location.protocol + '//www.google.com/cse/cse.js?cx=' + GCS_ENGINE_ID;

    var utilityNavGCS,
        primaryNavGCS,
        $utilitySearch,
        $primarySearch,
        resizeTimer;

    var initialize = function() {
      $utilitySearch = $('#utility-nav-search');
      $primarySearch = $('#primary-nav-search');

      // Must define window.__gsce before GCS script loads
      // Source: https://developers.google.com/custom-search/docs/tutorial/implementingsearchbox
      window.__gcse = {
        parsetags: 'explicit',
        callback: loadGCSElements
      };

      // GCS is also loaded in omni-nav.js. Only load script if it doesnt exist already.
      if($('script[src="'+ GCS_SOURCE +'"]').length == 0) {
        (function(){
          var cx = GCS_ENGINE_ID;
          var gcse = document.createElement('script');
          gcse.type = 'text/javascript';
          gcse.async = true;
          gcse.src = GCS_SOURCE;
          var s = document.getElementsByTagName('script')[0];
          s.parentNode.insertBefore(gcse, s);
        })();
      }

      $(window).on('resize', onWindowResize);
    };

    var onWindowResize = function() {
      clearTimeout(resizeTimer);

      resizeTimer = setTimeout(function(){
        if($(window).width() >= TABLET_BREAKPOINT && $primarySearch.hasClass('search-results-open')) {
          primaryNavGCS.hideSearchResults();
        } else if($(window).width() < TABLET_BREAKPOINT && $utilitySearch.hasClass('search-results-open')) {
          utilityNavGCS.hideSearchResults();
        }
      }, 250);
    }

    var loadGCSElements = function() {
      utilityNavGCS = new TwoColumnGCS();
      primaryNavGCS = new TwoColumnGCS();
      utilityNavGCS.init($utilitySearch);
      primaryNavGCS.init($primarySearch);
    };

    // two-column GCS(named by Google) layout consists of a search box and separate search results container
    // Layout option is set in the GCS control panel
    // Each GCS element must have a unique id to use as it's gname
    var TwoColumnGCS = function() {
      var SEARCH_RESULTS_BASE_URL = "//www.chapman.edu/search-results/index.aspx?",
        ENTER_KEY = 13,
        ESC_KEY = 27,
        DEFAULT_FILTER_TEXT = "Search From";

      var $element,
          $searchBox,
          $searchResults,
          $searchResultsContainer,
          $loadMoreResultsButton,
          $selectedSearchFilter,
          elementName,
          searchBoxConfig,
          searchResultsConfig,
          hasSearchFilters,
          gcsElement,
          resizeTimer;

      var initialize = function($el) {
        $element = $el;
        $searchBox = $element.find(".cu-search-box");
        $searchResultsContainer = $element.find('.search-results-container');
        $searchResults = $searchResultsContainer.find('.cu-search-results');
        $selectedSearchFilter = $element.find('.selected-search-filter');
        elementName = $element[0].id;
        hasSearchFilters = $element.find('.search-filter-option').length;
        utilityAutocompleteBound = false;
        primaryAutocompleteBound = false;

        searchBoxConfig = {
          gname: elementName,
          div: $searchBox[0],
          tag: 'searchbox',
          attributes: {
            enableAutoComplete: true,
            autoCompleteMatchType: 'any',
            resultSetSize: 6,
            enableHistory: false
          }
        };

        searchResultsConfig = {
          gname: elementName,
          div: $searchResults[0],
          tag: 'searchresults',
          attributes: {
            linkTarget: '_self',
            enableOrderBy: true
          }
        };

        renderGCSMarkup();
        updateSearchResultsHeight();

        //elements created after GCS markup is created
        gcsElement = google.search.cse.element.getElement(elementName);
        $loadMoreResultsButton = $searchResults.find('.more-results');

        //event binding
        $element.find('.search-filter-option').on('click', onSearchFilterClick);
        $searchBox.find('input.gsc-search-button').on('click', onSearchEnter);
        $searchBox.find('input.gsc-input').on('keyup', onSearchEnter);
        $searchBox.find('.gsc-clear-button').on('click', hideSearchResults);
        $(window).on('resize', onSearchResultsResize);
      };

      var onSearchFilterClick = function() {
        $selectedSearchFilter.text($(this).text());
      }

      var onSearchEnter = function(e) {
        // The autocomplete container is not present until the user starts typing
        // Add click event listener the first time it shows up
        bindAutocomplete();

        if((e.type == 'click' || e.which == ENTER_KEY) && gcsElement.getInputQuery().length > 0) {
          showSearchResults();
        }
      }

      var bindAutocomplete = function() {
        // If both containers are bound, don't execute again
        if(primaryAutocompleteBound && utilityAutocompleteBound) return;

        if($element[0].className.includes("utility") && !utilityAutocompleteBound) {
          $("table.gstl_50.gssb_c").find(".gsc-completion-container").on("click", onAutocompleteClick);
          utilityAutocompleteBound = true;
        }
        else if(!primaryAutocompleteBound) {
          $("table.gstl_51.gssb_c").find(".gsc-completion-container").on("click", onAutocompleteClick);
          primaryAutocompleteBound = true;
        }
      }

      var onAutocompleteClick = function(e) {
        setTimeout(showSearchResults, 100);
      }

      var onSearchEsc = function(e) {
        if(e.which == ESC_KEY){ hideSearchResults(); }
      }

      var onDocumentClick = function(e) {
        if($(e.target).is($searchResults, $searchBox) || $searchResults.has(e.target).length || $searchBox.has(e.target).length) {
          return;
        }
        hideSearchResults();
      }

      var onSearchResultsResize = function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(updateSearchResultsHeight, 500);
      }

      var renderGCSMarkup = function() {
        google.search.cse.element.render(searchBoxConfig, searchResultsConfig);
        $searchBox.find('input.gsc-input').attr('placeholder', 'Search');
        $searchResults.find('.gsc-control-cse').append($('<a>', {
          class: "more-results",
          href: SEARCH_RESULTS_BASE_URL,
          title: "See more results",
          text: "See more results"
        }));
      };

      var showSearchResults = function() {
        var term = gcsElement.getInputQuery();
        $loadMoreResultsButton.text('See more results for "'+term+'"');
        $loadMoreResultsButton.attr('href', SEARCH_RESULTS_BASE_URL + 'q=' + encodeURIComponent(term));
        $container.addClass('search-results-open');
        $element.addClass('search-results-open');
        lockScroll();
        $(document).on('keyup', onSearchEsc);
        $(document).on('click', onDocumentClick);

        // Trigger a click on the GCS tab corresponding to the search type dropdown selection
        // unfortunately GCS does not provide a callback for when search results
        // are returned so must use timeout
        if(hasSearchFilters) {
          setTimeout(function() {
            //tabs are created after each search executes so don't cache these selectors
            $('.gsc-tabsArea .gsc-tabHeader').each(function() {
              if ($(this).text() == $selectedSearchFilter.text()) {
                $(this).trigger('click');
                return false;
              }
            });

            $searchResultsContainer.fadeIn(200);
          }, 500);
        } else { $searchResultsContainer.fadeIn(200); }
      };

      var hideSearchResults = function() {
        $searchResultsContainer.hide();
        $container.removeClass('search-results-open');
        $element.removeClass('search-results-open');
        unlockScroll();
        gcsElement.clearAllResults();
        if(hasSearchFilters){ $selectedSearchFilter.text(DEFAULT_FILTER_TEXT); }
        $(document).off('keyup', onSearchEsc);
        $(document).off('click', onDocumentClick);
      };

      var updateSearchResultsHeight = function() {
        $searchResultsContainer.height($(window).height());
      };

      var lockScroll = function() {
        // lock scroll position, but retain settings for later
        var scrollPosition = [
          self.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft,
          self.pageYOffset || document.documentElement.scrollTop  || document.body.scrollTop
        ];

        var html = $('html');
        html.data('scroll-position', scrollPosition);
        html.data('previous-overflow', html.css('overflow'));
        html.css('overflow', 'hidden');
        window.scrollTo(scrollPosition[0], scrollPosition[1]);
      };

      var unlockScroll = function() {
        var html = $('html');
        var scrollPosition = html.data('scroll-position');
        html.css('overflow', 'visible');
        window.scrollTo(scrollPosition[0], scrollPosition[1]);
      };

      return {
        init: initialize,
        hideSearchResults: hideSearchResults
      };
    };

    return {
      init: initialize
    };
  })();

  // This module handles functionality associated with OffCanvasNav in particular.
  var OffCanvasNav = (function() {

    // Module Vars
    var $offCanvasLinks,
        resizeId;

    // Module Functions
    var initialize = function() {
      $offCanvasLinks = $('#js-off-canvas-nav > ul > li > a');
      syncLinkWidths();
      enableMenusToggle();

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
      $offCanvasLinks.css('width', width);
    };

    var enableMenusToggle = function() {
      // Enables toggle to slide main/umbrella menus back and forth.
      $('a.toggle-menu-label').on('click', function(e) {
        // Toggles headers.
        $('div#umbrella-logo').toggle('blind');

        // Slide-toggles the menus.
        $('div#off-canvas-umbrella').toggle('slide');
      });
    }

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
