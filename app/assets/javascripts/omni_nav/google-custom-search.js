var GoogleCustomSearch = (function() {
  var GCS_ENGINE_ID = '015856566681218627934:2ndbiubovo4';
  var GCS_SOURCE = location.protocol + '//www.google.com/cse/cse.js?cx=' + GCS_ENGINE_ID;

  var $omniNav,
      searchAPI;

  var initialize = function(omniNavId, searchBoxId) {
    $omniNav = $('#' + omniNavId);

    // Google Search JavaScript API
    // Source: https://developers.google.com/custom-search/docs/element#javascript
    window.__gcse = {
      parsetags: 'explicit',    // Components are rendered only with explicit calls
      callback: onGoogleSearchInitialized
    };

    loadGoogleSearchIfNotLoaded();

    searchAPI = new SearchComponent(searchBoxId);
    return searchAPI;
  };

  var loadGoogleSearchIfNotLoaded = function() {
    // GCS is also loaded in omni-nav.js. Only load script if it doesnt exist already.
    var alreadyLoaded = $('script[src="'+ GCS_SOURCE +'"]').length > 0;
    if ( ! alreadyLoaded ) {
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
  }

  var onGoogleSearchInitialized = function() {
    searchAPI.init();
  };

  /*
   * This object represents the Search component (search form and results block). It wraps
   * the Google element[0] and jQuery $elements representing the component in order to
   * provide an API tailored to OmniNav.
   *
   * [0] https://developers.google.com/custom-search/docs/element#cse-element
   */
  var SearchComponent = function(containerId) {
    // Constants
    var SEARCH_RESULTS_BASE_URL = "//www.chapman.edu/search-results/index.aspx?",
        ENTER_KEY = 13,
        ESC_KEY = 27,
        DEFAULT_FILTER_TEXT = "Search From";

    // Internal Attrs
    var $container,
        $searchBox,
        $searchResultsContainer,
        $searchResults,
        $selectedSearchFilter,
        $moreResultsButton,
        gcsElement,
        resizeTimeoutId;

    var init = function() {
      // jQuery Elements
      $container = $('#' + containerId);
      $searchBox = $container.find(".cu-search-box");
      $searchResultsContainer = $container.find('.search-results-container');
      $searchResults = $container.find('.cu-search-results');
      $selectedSearchFilter = $container.find('.selected-search-filter');
      $moreResultsButton = $('<a>', {
        class: "more-results",
        href: SEARCH_RESULTS_BASE_URL,
        text: "See more results"
      });

      renderGoogleSearchMarkup();
      applyStyleAdjustments();
      bindEventHandlers();
      $('button.gsc-search-button').append("<span>Search button</span>")
      // The Google Custom Search Element object. Can only be called after
      // renderGoogleSearchMarkup.
      gcsElement = google.search.cse.element.getElement(containerId);
    };

    var applyStyleAdjustments = function() {
      updateSearchResultsHeight();

      // These must be applied after Google's markup has been rendered.
      $searchBox.find('input.gsc-input').attr('placeholder', 'Search');
      $searchResults.find('.gsc-control-cse').append($moreResultsButton);
    };

    var bindEventHandlers = function() {
      $searchBox.find('input.gsc-search-button, button.gsc-search-button').on('click', onSearchEnter);
      $searchBox.find('input.gsc-input').on('keyup', onSearchEnter);
      $container.find('.search-filter-option').on('click', onSearchFilterClick);
      $searchBox.find('.gsc-clear-button').on('click', hideResults);
      $(window).on('resize', onSearchResultsResize);
    };

    var isOpen = function() {
      return $container.hasClass('search-results-open');
    };

    var hideResults = function() {
      // Reset results.
      $searchResultsContainer.hide();
      $omniNav.removeClass('search-results-open');
      $container.removeClass('search-results-open');
      unlockScroll();
      gcsElement.clearAllResults();
      $(document).off('keyup', onSearchEsc);
      $(document).off('click', onDocumentClick);

      // Clear search filters.
      var hasSearchFilters = $container.find('.search-filter-option').length;
      if ( hasSearchFilters ) $selectedSearchFilter.text(DEFAULT_FILTER_TEXT);
    };

    var renderGoogleSearchMarkup = function() {
      // Each GCS element must have a unique id to use as its gname.
      var searchBoxDiv = $searchBox[0];
      var searchResultsDiv = $searchResults[0];

      var searchBoxConfig = {
        gname: containerId,
        div: searchBoxDiv,
        tag: 'searchbox',
        attributes: {
          enableAutoComplete: true,
          autoCompleteMatchType: 'any',
          resultSetSize: 6,
          enableHistory: false
        }
      };

      var searchResultsConfig = {
        gname: containerId,
        div: searchResultsDiv,
        tag: 'searchresults',
        attributes: {
          linkTarget: '_self',
          enableOrderBy: true
        }
      };

      google.search.cse.element.render(searchBoxConfig, searchResultsConfig);
    };

    var updateSearchResultsHeight = function() {
      $searchResultsContainer.height($(window).height());
    };

    var onSearchEnter = function(e) {
      // The autocomplete container is not present until the user starts typing
      // Add click event listener the first time it shows up
      bindAutocomplete();

      var resultsRequested = e.type == 'click' || e.which == ENTER_KEY;
      var searchTermsPresent = gcsElement.getInputQuery().length > 0;
      if( resultsRequested && searchTermsPresent ) {
        showResults();
      }
    };

    var onSearchFilterClick = function() {
      $selectedSearchFilter.text($(this).text());
    };

    var onSearchResultsResize = function() {
      clearTimeout(resizeTimeoutId);
      resizeTimeoutId = setTimeout(updateSearchResultsHeight, 500);
    };

    var bindAutocomplete = function() {
      // Bind only once: use a data flag to track binding.
      var autoCompleteIsBound = $container.data('autoCompleteIsBound');
      if ( autoCompleteIsBound ) return;

      $container.data('autoCompleteIsBound', true);

      // Bind callback: when autocomplete option is clicked, show results. Interval
      // allows time for autoCompleteTable to be added to DOM.
      var intervalId = setInterval(function() {
        var $autoCompleteTable = $(".gsc-completion-container");
        var autoCompleteLoaded = $autoCompleteTable.length > 0;

        if ( autoCompleteLoaded ) {
          $autoCompleteTable.on("click", onAutoCompleteClick);
          clearInterval(intervalId);
        }
      }, 100);
    };

    var onAutoCompleteClick = function() {
      setTimeout(showResults, 100);
    };

    var showResults = function() {
      var term = gcsElement.getInputQuery();
      var moreResultsUrl = SEARCH_RESULTS_BASE_URL + 'q=' + encodeURIComponent(term);
      var hasSearchFilters = $container.find('.search-filter-option').length;

      // Update More Results button.
      $moreResultsButton.text('See more results for "' + term + '"');
      $moreResultsButton.attr('href', moreResultsUrl);

      // Mark results open.
      $omniNav.addClass('search-results-open');
      $container.addClass('search-results-open');

      // Bind callbacks.
      lockScroll();
      $(document).on('keyup', onSearchEsc);
      $(document).on('click', onDocumentClick);

      // Trigger a click on the GCS tab corresponding to the search type dropdown selection
      // unfortunately GCS does not provide a callback for when search results
      // are returned so must use timeout
      if ( hasSearchFilters ) {
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
      }
      else {
        $searchResultsContainer.fadeIn(200);
      }
    };

    var onSearchEsc = function(e) {
      if ( e.which == ESC_KEY ) { hideResults(); }
    };

    var onDocumentClick = function(e) {
      if( $(e.target).is($searchResults, $searchBox) ||
          $searchResults.has(e.target).length ||
          $searchBox.has(e.target).length ) {
        return;
      }
      hideResults();
    };

    var lockScroll = function() {
      // lock scroll position, but retain settings for later
      var xLeft = window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft;
      var yTop = window.pageYOffset || document.documentElement.scrollTop  || document.body.scrollTop;
      var scrollPosition = [xLeft, yTop];

      var html = $('html');
      html.data('scroll-position', scrollPosition);
      html.data('previous-overflow', html.css('overflow'));
      html.css('overflow', 'hidden');
      window.scrollTo(xLeft, yTop);
    };

    var unlockScroll = function() {
      var html = $('html');
      var scrollPosition = html.data('scroll-position');
      html.css('overflow', 'visible');
      window.scrollTo(scrollPosition[0], scrollPosition[1]);
    };

    // Returns API
    return {
      init: init,
      isOpen: isOpen,
      hideResults: hideResults
    };
  }

  return {
    init: initialize
  };
})();
