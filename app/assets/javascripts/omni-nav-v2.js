var OmniNav2 = (function() {

  // Constants
  var TABLET_BREAKPOINT = 768; //px
  var DESKTOP_BREAKPOINT = 1024;

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
    $('html').addClass('omni-nav-v2');
    $('.utility-nav-trigger').on('click', onUtilityNavClick);
    $utilityNav.find('li.utility-has-dropdown').on('click', onUtilityNavDropdownClick);
    
    // Adjusts CSS to accomodate primary nav stacked on top of global nav when branded
    if ( $('html').find('#omni-nav-v2').hasClass('branded') ) {
      $('html').addClass('branded');
    }

    // Remove padding from theme version. Have to use js because css will not work.
    // See https://stackoverflow.com/a/1014958/6763239
    $('#theme header').css('padding-bottom', '0px');
  }

  var onUtilityNavClick = function() {
    $('.primary-nav-action').toggleClass("utility-open");

    if ($(window).width() >= DESKTOP_BREAKPOINT) {
      // slideToggle() sets display: block by default but utility-nav-container needs to be table-cell
      $utilityNav.find('.utility-nav-container').slideToggle(function() {
        $(this).css('display', 'table-cell');
      });

      $utilityNav.toggleClass('utility-nav-open').slideToggle();
      $('html.omni-nav-v2').toggleClass('utility-nav-open');
      $primaryNav.removeClass('search-open');
    } 
    else if (($(window).width() >= TABLET_BREAKPOINT) && $(window).width() < DESKTOP_BREAKPOINT ) {
      // on tablet size, utility-links don't show, only utility-search
      $utilityNav.find('.utility-nav-container.utility-search').slideToggle( function() {
        $(this).css('display', 'table-cell');
      });

      $utilityNav.find('.utility-nav-container.utility-links').css('display', 'none');
      $utilityNav.toggleClass('utility-nav-open').slideToggle();
      $('html.omni-nav-v2').toggleClass('utility-nav-open');
      $primaryNav.removeClass('search-open');
    }
    else {
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
        if((e.type == 'click' || e.which == ENTER_KEY) && gcsElement.getInputQuery().length > 0) {
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
