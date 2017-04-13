/* global window */
/* global google:false */
/* global chapman:false */

chapman.virtualtour.StreetViewBar = (function ($, window) {

	'use strict';
	
	var cvt = chapman.virtualtour;
	var pegmanOnly = false;
	var inStreetViewService = false;

	var init = function () {
		var images = this.images = $('.street-view-data input[type="hidden"]');
		var container = this.container = $('#streetViewBar');

		this.formattedImages = [];
		this.map          = cvt.Map.chapmanMap;
		this.mapContainer = $('#streetViewCanvas').get(0);

		this.each_image(images);
		this.setup_list(container);
		this.register_listeners();

		$('.streetViewBar ul').bxSlider({
			slideMargin: 5,
			adaptiveHeight: true,
			responsive: false,
			controls: true,
			pager: false,
			minSlides: 1,
			maxSlides: 10,
			slideWidth: 250
		});

	};

	var each_image = function (images) {
		var formattedImages = this.formattedImages;
		var methods         = this;
		// Start at 1 because the default map is 0
		var idCounter = 1;

		$.each(images, function (index, value) {
			var thisVal     = $(value).attr('value');
			var queryString = methods.parse_url(thisVal);
			var url         = methods.format_url(queryString);
			var name        = $(value).data('name');
			var icon        = $(value).data('icon');

			formattedImages.push({
				parsedUrl: url,
				originalUrl: thisVal,
				qs: queryString,
				id: idCounter,
				icon: icon,
				name: name
			});

			idCounter++;
		});
	};

	var parse_url = function (url) {
		var data;
		var queryString = {};
		var pano;

		// y = FOV
		// h = heading
		// t = pitch

		if (!url) {
			return false;
		}

		data = url.split('/');

		// Get the coordinates and positioning data
		data.forEach(function (value, index) {
			if (/@/.test(value)) {
				data = value;
			} else if (/data=/.test(value)) {
				pano = value;
			}
		});

		data = data.split('@')[1];
		data = data.split(',');

		// Remove the non numeric codes
		data.forEach(function (value, index) {
			data[index] = value.split(/[a-zA-Z]/)[0];
		});

		pano = this.parse_pano(pano);

		queryString.ll      = data[0] + ',' + data[1];
		queryString.yaw     = data[4];
		queryString.heading = data[4];
		queryString.pitch   = data[5];
		queryString.panoid  = pano;
		queryString.h       = 200;
		queryString.w       = 350;

		// For an unknown reason, street view add 90 degrees to the pitch
		queryString.pitch = queryString.pitch - 90;

		return queryString;
	};

	var parse_pano = function (pano) {
		var parsed;

		/* example string:
		 data=!3m5!1e1!3m3!1sfPhZjlaq_sAAAAQYNw-Ypw!2e0!3e11!4m2!3m1!1s0x14a1bd1837f5acf3:0x5c97c042f5eb0df6

		 Split on the "!<1-10><a-z>":
		 0) data=
		 1) !3m 5
		 2) !1e 1
		 3) !3m 3
		 4) !1s fPhZjlaq_sAAAAQYNw-Ypw
		 5) !2e 0
		 6) !3e 11
		 7) !4m 2
		 8) !3m 1
		 9) !1s 0x14a1bd1837f5acf3:0x5c97c042f5eb0df6
		 */


		if (pano) {
			parsed = pano.split(/!\d\D/g);
			return parsed[4];

		} else {
			return false;
		}
	};

	var format_url = function (url, size) {
		var thisSize = size;
		var href     = '';

		if (!thisSize) {
			thisSize = '400x400';
		}

		href = 'https://geo2.ggpht.com/cbk?output=thumbnail&thumb=1&cb_client=maps_sv.gps.maps_sv.tactile';


		$.each(url, function (index, value) {
			if (value) {
				href += ('&' + index + '=' + value);
			}
		});

		return href;
	};

	var setup_list = function (container) {
		var html            = '<ul class="street-view-tile slides" data-partial="street-view-tile">';
		var formattedImages = this.formattedImages;
		var self            = this;

		formattedImages.forEach(function (value, index) {
			html += self.add_image(value);
		});

		html += '</ul>';
		container.append(html);
	};

	var add_image = function (image) {
		var qs   = JSON.stringify(image.qs);
		var icon = image.icon === 'photo' ? 'photo' : 'street-pano';

		return '' +
			'<li class="street-slide">' +
			'<div class="tile-container">' +
			'<div class="img-container">' +
			'<img class="streetViewImg" src="' + image.parsedUrl +
			'" data-original-href="' + image.originalUrl +
			'" data-id="' + image.id +
			'" data-query-string=' + qs + ' />' +
			'</div>' +
			'<div class="icon-container">' +
			'<span class="icon ' + icon + '"></span>' +
			'<span class="title">' + image.name + '</span>' +
			'</div>' +
			'</div>' +
			'</li>';
	};

	var register_listeners = function () {

		var $self = this;
		var subStreet = $self.map.getStreetView();

		$('.street-view').on('click', '.streetViewImg', function () {

			// Reset map nav
			if ($('#virtualTour-mapBtn').hasClass('primary') || $('#virtualTour-tourBtn').hasClass('primary')) {
				$('#virtualTour-mapBtn, #virtualTour-tourBtn').removeClass('primary');
			}

			// Close jMenu
			if ($('#js-jmenu--slide-left').hasClass('is-active')) {
				$('#js-jmenu--slide-left').removeClass('is-active');
			}

			// Hide Virtual Tour Detail
			if ($('#virtualTour-detail').hasClass('is-active')) {
				$('#virtualTour-detail').removeClass('is-active');
			} else if ($('#virtualTour-detail').hasClass('is-open')) {
				$('#virtualTour-detail').addClass('has-content').removeClass('is-open');
			}

			$('#map-header, #virtualTour-streetView').fadeOut(500);

			setTimeout(function () {
				make_known_street_view.call(this, $self);
			}.bind(this), 300);

		});

		$('#virtualTour-mapColumn').on('click', '.streetViewBtn', function (e) {
			e.preventDefault();
			make_known_street_view.call(this, $self);
		});

		$('#virtualTour-mapColumn').on('click', '.open-street-view', function (e) {
			e.preventDefault();
			var button = $(e.target);
			make_unknown_street_view.call(this, $self, button);
		});

		// Street view triggered by dropping the pegman before you ever select any other street view
		google.maps.event.addListener(subStreet, 'position_changed', function () {

			if (cvt.streetViewMap && cvt.streetViewMap.getVisible()) {
				cvt.streetViewMap.setVisible(false);
			}

			if (!$('#streetViewCanvas').is(':visible')) {

				if (!cvt.originalStreetView) {
					$self.originalStreetView = subStreet;
					cvt.originalStreetView = subStreet;
				}

				add_controls($self, 'original', 'map');
			}

		});

	};

	var make_unknown_street_view = function ($self, button) {
		var mapContainer  = $self.mapContainer;
		var options = set_options.call(this, $self, true);
		var streetOptions = options.streetOptions;
		var thisStreet = options.thisStreet;

		var streetView = new google.maps.StreetViewService();
		reset_maps.call(this, $self);

		streetView.getPanoramaByLocation(thisStreet, 100, function (data, status) {
			if (status === google.maps.StreetViewStatus.OK) {

				$self.streetViewMap = new google.maps.StreetViewPanorama(mapContainer, streetOptions);

				$self.streetViewMap.setPano(data.location.pano);

				$self.map.setStreetView($self.streetViewMap);

				google_listeners($self, thisStreet);
				add_controls.call(this, $self, 'streetView', 'street');
				toggle_maps($self, 'streetView');
				google_listeners($self);

				$self.streetViewMap.setVisible(true);
				chapman.virtualtour.StreetViewBar.inStreetViewService = true;
			} else {
				button.text('Street View is Unavailable');
			}

		});
	};

	var make_known_street_view = function ($self) {
		var mapContainer  = $self.mapContainer;
		var streetOptions = set_options.call(this, $self).streetOptions;

		reset_maps.call(this, $self);

		$self.streetViewMap = new google.maps.StreetViewPanorama(mapContainer, streetOptions);

		toggle_maps($self, 'streetView');

		add_controls.call(this, $self, 'streetView', 'street');

		google_listeners($self);
		$self.streetViewMap.setVisible(true);
	};

	var set_options = function ($self, streetViewService) {
		var data          = $(this).data('query-string');
		var heading       = data ? parseFloat(data.heading) : undefined;
		var pitch         = data ? parseFloat(data.pitch) : undefined;
		var location      = streetViewService ? $self.get_location($(this).data('ll')) : $self.get_location(data);
		var thisStreet    = new google.maps.LatLng(location[0], location[1]);
		var streetOptions = {
			position: thisStreet
		};

		if (streetViewService) {
			streetOptions.radius = 100;
		} else {
			streetOptions.pov = {
				heading: heading,
				pitch: pitch
			};

			if (data.panoid) {
				streetOptions.pano = data.panoid;
			}
		}

		return {
			streetOptions: streetOptions,
			thisStreet: thisStreet
		};
	};

	var google_listeners = function ($self, thisStreet) {
		// Center the original map on the street view's location.
		// If they click "back to map" they will be centered on the street view's location
		google.maps.event.addListenerOnce(cvt.Map.chapmanMap, 'bounds_changed', function () {
			cvt.Map.chapmanMap.setCenter(thisStreet);
		});

		// When setting the pegman
		google.maps.event.addListener($self.streetViewMap, 'visible_changed', function () {
			if (cvt.originalStreetView && cvt.originalStreetView.getVisible()) {
				cvt.originalStreetView.setVisible(false);
			}

			if ($self.streetViewMap && !$self.streetViewMap.getVisible()) {
				toggle_maps($self, 'streetView');
			}
		});
	};

	var toggle_maps = function ($self, mapType) {
		if (mapType === 'streetView') {
			$('#virtualTour-mapCanvas').hide();
			$('#streetViewCanvas').show();

			cvt.streetViewMap = $self.streetViewMap;

			if (cvt.StreetViewBar.pegmanOnly) {
				cvt.streetViewMap.setVisible(true);
				cvt.StreetViewBar.pegmanOnly = false;
			}

		} else if (mapType === 'original') {
			$('#virtualTour-mapCanvas').show();
			$('#streetViewCanvas').hide();

			cvt.streetViewMap.setVisible(false);
		}

	};

	var add_controls = function ($self, mapType, issuesType) {
		var back = $('.controls-back');
		var issues = $('.issues-' + issuesType);
		var link = $('.controls-link');
		var showIssues = $('html.no-js').length ? true : false;

		if (mapType === 'streetView') {

			back.show();

			if ($self.originalStreetView) {
				$self.originalStreetView.controls[google.maps.ControlPosition.LEFT_BOTTOM].clear();
			}
			if (showIssues) {
				$self.streetViewMap.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(issues[0]);
				issues.find('.control-issues').show();
			}

			$self.streetViewMap.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(back[0]);

		} else if (mapType === 'original') {

			back.show();

			if (showIssues) {
				$self.streetViewMap.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(issues[0]);
				issues.find('.control-issues').show();
			}

			$self.originalStreetView.controls[google.maps.ControlPosition.LEFT_BOTTOM].clear();
			$self.originalStreetView.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(back[0]);

		} else if (mapType === 'main') {

			link.show();

			if (showIssues) {
				$self.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(issues[0]);
				issues.find('.control-issues').show();
			}

			$self.controls[google.maps.ControlPosition.TOP_LEFT].push(link[0]);

		}

	};

	var reset_maps = function ($self) {
		if (cvt.originalStreetView && cvt.originalStreetView.getVisible()) {
			cvt.originalStreetView.setVisible(false);
		}

		if (cvt.streetViewMap && cvt.streetViewMap.getVisible()) {
			cvt.streetViewMap.setVisible(false);
		}
	};

	var get_location = function (data) {
		var latLng;
		var lat;
		var lng;

		if (!data) {
			return false;
		}

		latLng = data.ll || data;
		latLng = latLng.split(',');

		lat = parseFloat(latLng[0]);
		lng = parseFloat(latLng[1]);

		return [lat, lng];
	};

	return {
		init: init,
		each_image: each_image,
		parse_url: parse_url,
		parse_pano: parse_pano,
		format_url: format_url,
		setup_list: setup_list,
		add_image: add_image,
		register_listeners: register_listeners,
		get_location: get_location,
		pegmanOnly: pegmanOnly,
		inStreetViewService: inStreetViewService,
		add_controls: add_controls
	};

})(window.jQuery, window);
