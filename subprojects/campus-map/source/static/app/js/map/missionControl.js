/* global window */
/* global chapman:false */
/* global Modernizr:false */

/**
 * MissionControl
 */

chapman.virtualtour.MissionControl = (function ($, updateLocation, document, window) {

    'use strict';

	var _browserTitle = document.title,
		_isIE8 = false;

	var _qs = (function(a) {

		if (a === '') {
            return {};
        }

		var b = {};

		for (var i = 0; i < a.length; ++i) {
			var p = a[i].split('=');

			if (p.length !== 2) {
                continue;
            }

			b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, ' '));

		}

		return b;

	})(window.location.search.substr(1).split('&'));

	var _desktopMediaQuery = 'screen and (min-width: 768px)',
		_mobileMediaQuery = 'screen and (min-width: 320px)',
		_print = false,
		_staticPrintURL = '',
		_screenSize,
		_initialized = false;

	var _init = function(print) {

		_print = print;

		$(window).on('debouncedresize', _resized);

		$('#virtualTour-shuttleBtn').click(function(event) {
			var url = $(this).data().url;
			window.open(url, '_blank');
			return false;
		});

		$('#virtualTour-backButton').click(function(e) {
			var hash = window.location.hash;

			if (hash !== '' && hash !== '#') {
				$.History.trigger();
			}

		});

		chapman.virtualtour.VirtualTourPanel.registerListeners();

		_updateScreenSize();

	};

	var _updateScreenSize = function () {

		if (Modernizr.mq(_desktopMediaQuery) || _isIE8) {
			return _desktopEntry();
		} else if (Modernizr.mq(_mobileMediaQuery)) {
			return _mobileEntryLanding();
		} else {
			return _desktopEntry();
		}

	};

	var _mapReady = function() {

		var hash,
			id;

		chapman.virtualtour.MainNavigation.init();
		chapman.virtualtour.CategoryMenu.init();
		chapman.virtualtour.ManagePanels.init();
		chapman.virtualtour.Search.init();

		$.History.bind(function(state) {
			var title = _browserTitle,
				activeMarker,
				activeMarkerData,
				markerTitle;

			if (state !== '') {

				if (!_initialized) {
					_initialized = true;
				}

				// markers will have been created by this point
				chapman.virtualtour.Map.updateMapById(state);

				if (state !== 'campus-map' && state !== 'virtual-tour') {
					chapman.virtualtour.ManagePanels.showDetail(state);
				}

				activeMarker = $('#' + state);
				activeMarkerData = activeMarker.data();

				markerTitle = chapman.virtualtour.CategoryMenu.getTitleById(state);
				title = markerTitle + ' | ' + _browserTitle;
			}

			// Update the page's title with our current state on the end
			document.title = title;

		});

		// deep link this
		hash = window.location.hash;
		id = hash.substr(1, hash.length);

		// Landmarks
		if (hash === '#campus-map') {
			setTimeout(function (e) {
				if (!$('#virtualTour-mapBtn').hasClass('primary')) {
					$('#virtualTour-mapBtn').trigger('click', function (e) {
						chapman.virtualtour.VirtualTourPanel.switchPanels(e);
					});
				}
			}, 1000);
		// Virtual Tour
		} else if (hash === '#virtual-tour') {
			setTimeout(function (e) {
				if (!$('#virtualTour-tourBtn').hasClass('primary')) {
					$('#virtualTour-tourBtn').trigger('click', function (e) {
						chapman.virtualtour.VirtualTourPanel.switchPanels(e);
					});
				}
			}, 1000);
		// Find Attraction Detail/Marker
		} else {
			$.History.go(id);
		}

	};

	var _resized = function() {

		if (Modernizr.mq(_desktopMediaQuery) || _isIE8) {
			_desktopEntry();
		} else {
			_mobileEntry();
		}

	};

	var _desktopEntry = function() {

		if (_screenSize !== 'big') {

			_screenSize = 'big';

			chapman.virtualtour.Map.init();

			if (!$('.bx-wrapper').length) {
				chapman.virtualtour.StreetViewBar.init();
				chapman.virtualtour.Overlays.init();
				$('.street-view').show();
			} else {
				$('.street-view').show();
			}

		}

	};

	var _mobileEntryLanding = function () {

		if (_screenSize !== 'small') {

			_screenSize = 'small';

			chapman.virtualtour.Map.init();

			$('.street-view').hide();

		}

	};

	var _mobileEntry = function() {

		if (_screenSize !== 'small') {

			_mapReady();

			_screenSize = 'small';

			$('.street-view').hide();

		}

	};

	var _isDesktop = function() {
		var isDesktop = false;

		if (Modernizr.mq(_desktopMediaQuery) || _isIE8) {
			return true;
		}

		return isDesktop;

	};

	var _isPrint = function() {
		return _print;
	};

	var _mouseOrFinger = function() {
		var mouseOrFinger;

		if('ontouchstart' in document.documentElement) {
			mouseOrFinger = 'finger';
		}

		return mouseOrFinger;

	};

	/**
	 * Updates window.location
	 */
	var _updateQueryString = function(markers) {
		var queryString = '',
			len = markers.length,
			i,
			markerId,
			type,
			url,
			printUrl;

		for (i in markers) {
			if (markers.hasOwnProperty(i)) {
				markerId = markers[i].id;
				type = markers[i].type;

				if (type === 'kml') {
					markerId = markers[i].obj.id;
				}

				if (i < len - 1) {
					queryString += markerId + ',';
				} else {
					queryString += markerId;
				}
			}
		}

		url = updateLocation('s', queryString);

		$('#virtualTour-deepLink').attr('href', url).fadeIn();

		if (_staticPrintURL === '') {
			_staticPrintURL = $('#virtualTour-printButton').data().url;
		}

		printUrl = updateLocation('s', queryString, _staticPrintURL + '.aspx');

		$('#virtualTour-printButton').attr('href', printUrl);

	};

	var _getQueryStringSelections = function() {
		var selections = {};

		if (_qs.s !== undefined) {
			selections = _qs.s.split(',');
		}

		return selections;

	};

	return {
		init: _init,
		isDesktop: _isDesktop,
		isPrint: _isPrint,
		mouseOrFinger: _mouseOrFinger,
		updateQueryString: _updateQueryString,
		getQueryStringSelections: _getQueryStringSelections,
		mapReady: _mapReady,
		updateScreenSize: _updateScreenSize
	};

})(window.jQuery, window.updateLocation, window.document, window);
