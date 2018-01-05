var GoogleCustomSearch = (function() {
  var GCS_ENGINE_ID = '015856566681218627934:2ndbiubovo4';
  var GCS_SOURCE = location.protocol + '//www.google.com/cse/cse.js?cx=' + GCS_ENGINE_ID;

  var utilityNavGCS,
      primaryNavGCS,
      $utilitySearch,
      $primarySearch,
      resizeTimer,
      tabletBreakpoint,
      searchAPI;

  var initialize = function(omniNavContainer, omniNavTabletBreakpoint) {
    $omniNavContainer = omniNavContainer;
    tabletBreakpoint = omniNavTabletBreakpoint;

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

    searchAPI = {
      primaryNavForm: new SearchComponent('#utility-nav-search'),
      utilityNavForm: new SearchComponent('#primary-nav-search')
    };
    return searchAPI;

    //$(window).on('resize', onWindowResize);
  };

  var onWindowResize = function() {
    clearTimeout(resizeTimer);

    resizeTimer = setTimeout(function(){
      if($(window).width() >= tabletBreakpoint && $primarySearch.hasClass('search-results-open')) {
        primaryNavGCS.hideSearchResults();
      } else if($(window).width() < tabletBreakpoint && $utilitySearch.hasClass('search-results-open')) {
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

  // TODO: This will replace TwoColumnGCS below and be returned by the parent module init method.
  var SearchComponent = function(parentId) {
    var isOpen = function() {
      console.debug('TODO: isOpen:', parentId);
      return true;
    };

    var hideResults = function() {
      console.debug('TODO: hide:', parentId);
    };

    return {
      isOpen: isOpen,
      hideResults: hideResults
    };
  }

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

      // indexOf = -1 if not found
      if(($element[0].className.indexOf("utility") >= 0) && !utilityAutocompleteBound) {
        $("table.gstl_50.gssb_c").find(".gsc-completion-container").on("click", onAutocompleteClick);
        utilityAutocompleteBound = true;
      }
      else if(!primaryAutocompleteBound) {
        $("table.gstl_51.gssb_c").find(".gsc-completion-container").on("click", onAutocompleteClick);
        primaryAutocompleteBound = true;
      }
    }

    var onAutocompleteClick = function(e) {
      setTimeout(showSearchResults, 100); // Waits for autocomplete to add to DOM
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
      $omniNavContainer.addClass('search-results-open');
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
      $omniNavContainer.removeClass('search-results-open');
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
