var OmniNav2 = (function() {

  // Constants
  var TABLET_BREAKPOINT = 768; //px

  // Module Vars
  var $container,
      $utilityNav,
      $primaryNav;

  // Module Functions
  var initialize = function(container) {
    GoogleCustomSearch.init();
    OffCanvasNav.init();
    $container = container;
    $utilityNav = $container.find('.utility-nav');
    $primaryNav = $container.find('#primary-nav');
    $utilitySearch = $utilityNav.find('.utility-search');
    $('.utility-nav-trigger').on('click', onUtilityNavClick);
    $utilityNav.find('li.utility-has-dropdown').on('click', onUtilityNavDropdownClick);
    $utilitySearch.find('.search-type-option').on('click', onUtilitySearchSelect);

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

  var onUtilitySearchSelect = function() {
    var searchType = $(this).children('a').text();
    $("#selected-search-type").text(searchType);
  };

  var GoogleCustomSearch = (function() {
    var GCS_ENGINE_ID = '015856566681218627934:2ndbiubovo4';
    var GCS_SOURCE = location.protocol + '//www.google.com/cse/cse.js?cx=' + GCS_ENGINE_ID;
    var searchElements = [];

    var initialize = function() {
      searchElements = $(".cu-two-column-gcs");

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
    };

    var loadGCSElements = function() {
      searchElements.each(function() {
        var element = new TwoColumnGCS();
        element.init($(this));
      });
    };

    // two-column GCS(named by Google) layout consists of a search box and separate search results container
    // Layout option is set in the GCS control panel
    var TwoColumnGCS = function() {
      var SEARCH_RESULTS_BASE_URL = "www.chapman.edu/search-results/index.aspx?";
      var ENTER_KEY = 13;
      var ESC_KEY = 27;

      var $element,
          $searchBox,
          $searchResults,
          $searchResultsContainer,
          $loadMoreResultsButton,
          elementName,
          searchBoxConfig,
          searchResultsConfig,
          gcsElement;

      var initialize = function($el) {
        $element = $el;
        $searchBox = $element.children(".cu-search-box");
        $searchResultsContainer = $element.children('.search-results-container');
        $searchResults = $searchResultsContainer.children('.cu-search-results');
        elementName = $element[0].id;

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

        $searchBox.find('input.gsc-search-button').on('click', onSearchEnter);
        $searchBox.find('input.gsc-input').on('keyup', onSearchEnter);
        $searchBox.find('.gsc-clear-button').on('click', hideSearchResults);
      };

      var onSearchEnter = function(e) {
        if((e.type == 'click' || e.which == ENTER_KEY) && gcsElement.getInputQuery().length > 0){
          showSearchResults();
        }
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

      var renderGCSMarkup = function() {
        google.search.cse.element.render(searchBoxConfig, searchResultsConfig);
        $searchBox.find('input.gsc-input').attr('placeholder', 'Search');
        $searchResults.find('.gsc-control-cse').append($('<a>', {class: "more-results", href: SEARCH_RESULTS_BASE_URL}));
      };

      var showSearchResults = function() {
        var term = gcsElement.getInputQuery();
        $loadMoreResultsButton.text('See more results for "'+term+'"');
        $searchResultsContainer.fadeIn(200);
        $container.addClass('search-results-open');
        lockScroll();
        $(document).on('keyup', onSearchEsc);
        $(document).on('click', onDocumentClick);
      };

      var hideSearchResults = function() {
        $searchResultsContainer.fadeOut(200);
        $container.removeClass('search-results-open');
        unlockScroll();
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

  return {
    init: initialize
  };
})();

$(document).ready(function () {
  OmniNav2.init($('#omni-nav-v2'));
});
