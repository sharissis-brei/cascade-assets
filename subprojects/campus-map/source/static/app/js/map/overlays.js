/* global window */
/* global chapman:false */
/* global google:false */

/**
 * Overlays
 */

chapman.virtualtour = chapman.virtualtour || {};

chapman.virtualtour.Overlays = (function ($, overlayJson, window) {

	'use strict';

	var init = function () {
		polygons();
		overlays();
		registerListeners();
	};

	var polygons = function () {
		var collection = [];

		// Create the Lat and Lng objects in an array for each individual overlay
		$.each(overlayJson, function (index, value) {
			var overlay = [];

			$.each(value.coords, function (subIndex, subValue) {
				var coords = subValue;
				var ll;

				coords = coords.split(',');
				ll = new google.maps.LatLng(coords[0], coords[1]);

				overlay.push(ll);
			});

			collection.push(overlay);
		});

		// Create each new overlay (polylines)
		$.each(collection, function (index, value) {
			var overlay = new google.maps.Polygon({
				path: value,
				strokeColor: '#98002e',
				strokeWeight: 2,
				strokeOpacity: 0.25,
				fillColor: '#98002e',
				fillOpacity: 0.05,
				map: chapman.virtualtour.Map.chapmanMap
			});
			return overlay;
		});
	};

	var overlays = function () {
		var map = chapman.virtualtour.Map.chapmanMap;
		chapman.virtualtour.StreetViewBar.add_controls(map, 'main', 'map');
	};

	var registerListeners = function () {

		$('.controls-back').click(function (e) {

			e.preventDefault();

			var cvt = chapman.virtualtour;

			if (cvt.originalStreetView && cvt.originalStreetView.getVisible()) {
				cvt.originalStreetView.setVisible(false);
			}

			if (cvt.streetViewMap && cvt.streetViewMap.getVisible()) {
				cvt.streetViewMap.setVisible(false);
			}

			if (cvt.StreetViewBar.inStreetViewService) {
				cvt.StreetViewBar.inStreetViewService = false;
				cvt.StreetViewBar.pegmanOnly = true;
			} else {
				cvt.StreetViewBar.pegmanOnly = false;
			}

			$('#virtualTour-mapCanvas').show();
			$('#streetViewCanvas').hide();

			// Show Virtual Tour Detail
			if (!$('#virtualTour-detail').is(':empty')) {
				if ($('#virtualTour-detail').hasClass('has-content')) {
					$('#virtualTour-detail').addClass('is-open');
				} else {
					$('#virtualTour-detail').addClass('is-active');
				}
			}

			$('#map-header, #virtualTour-streetView').fadeIn(500);
			
		});
	};

	return {
		init: init
	};

})(window.jQuery, window.overlayJson);
