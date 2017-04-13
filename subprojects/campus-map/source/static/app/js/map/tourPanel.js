/* global window */
/* global chapman:false */
/* global google:false */

/**
 * VirtualTourPanel
 */

chapman.virtualtour.VirtualTourPanel = (function ($, window) {

	'use strict';

	var registerListeners = function () {

		$('#virtualTour-navContainer').on('click', '.button', function (e) {

			e.preventDefault();

			$('#virtualTour-detail').removeClass('is-active').empty();

			if ($(e.target).hasClass('primary')) {

				$(e.target).removeClass('primary');

				$('#js-hamburger').removeClass('is-active');

				$('#js-jmenu--slide-left').removeClass('is-active');

				$.History.go('');

				return;

			} else {

				switchPanels(e);

			}

		});

		// Virtual Tour Attraction Detail
		$('body').on('click', '#virtualTour-attractionHeader', function () {

			if ($('#virtualTour-attractionHeader').hasClass('is-fixed')) {
				$('#virtualTour-attractionHeader').removeClass('is-fixed');
				$('#virtualTour-contentContainer').css('margin-top', '0');
			}

			if ($('#virtualTour-attractionHeader').hasClass('move-left')) {
				$('#virtualTour-attractionHeader').removeClass('move-left');
			}

			$('#virtualTour-detail').toggleClass('is-active is-open');

		});

		// "Fix" the Virtual Tour Attraction Header when scrolling
		$('#virtualTour-detail').on('scroll', function () {

			var headerHeight = ($('#virtualTour-bxSlider').outerHeight(true) - $('#virtualTour-attractionHeader').outerHeight(true)) + $('#map-header').outerHeight(true),
				scrollHeight = $(this).scrollTop();

			if (scrollHeight <= (headerHeight - ($('.virtualTour-backButtonContainer').outerHeight(true) / 2))) {
				$('#virtualTour-attractionHeader').removeClass('move-left').promise().done(function () {
					$('#virtualTour-backButton').removeClass('move-top');
				});
			}

			if (scrollHeight >= (headerHeight - ($('.virtualTour-backButtonContainer').outerHeight(true) / 2))) {
				$('#virtualTour-attractionHeader').addClass('move-left').promise().done(function () {
					$('#virtualTour-backButton').addClass('move-top');
				});
			}

			if (scrollHeight >= headerHeight) {
				$('#virtualTour-attractionHeader').addClass('is-fixed');
				$('#virtualTour-contentContainer').css('margin-top', '86px');
			} else {
				$('#virtualTour-attractionHeader').removeClass('is-fixed');
				$('#virtualTour-contentContainer').css('margin-top', '0');
			}

		});

		$('body').on('click', '#virtualTour-backButton', function (e) {

			e.preventDefault();

			$('#virtualTour-detail').removeClass('is-open').promise().done(function () {

				$(this).empty();

				if ($('#virtualTour-mapBtn').attr('data-active') === 'true') {

					$('#virtualTour-mapBtn').addClass('primary');

					window.location.hash = '#campus-map';

				} else if ($('#virtualTour-tourBtn').attr('data-active') === 'true') {

					$('#virtualTour-tourBtn').addClass('primary');

					window.location.hash = '#virtual-tour';

				} else {

					$('#virtualTour-mapBtn').addClass('primary');
					$('#virtualTour-panel').hide();

					window.location.hash = '#campus-map';

				}

				// jMenu plugin
				if (!$('#js-jmenu--slide-left').hasClass('is-active')) {
					$('#js-jmenu--slide-left').addClass('is-active');
				}

			});

		});

		// "Go To Map" call-to-action
		$('#virtualTour-goToMapCTA').on('click', function (e) {

			e.preventDefault();

			// Reset map nav
			if ($('#virtualTour-mapBtn').hasClass('primary') || $('#virtualTour-tourBtn').hasClass('primary')) {
				$('#virtualTour-mapBtn, #virtualTour-tourBtn').removeClass('primary');
			}

			// Close jMenu off-screen canvas
			$('#js-jmenu--slide-left').removeClass('is-active');

			$.History.go('');

		});

		$('.virtualTour-categoryCheckboxLabel').click(function (e) {
			if ($(e.target).prop('checked')) {
				removeOrAddMarkers('map', e);
			}
		});

		$('.go-to-info').on('click', function (e) {

			e.preventDefault();

			var id = $(this).data('id');

			// Reset map nav
			if ($('#virtualTour-tourBtn').hasClass('primary')) {
				$('#virtualTour-tourBtn').removeClass('primary');
			}

			if (id) {
				chapman.virtualtour.ManagePanels.showDetail(id);
				$.History.go(id);
			}

		});

		/*
		 * Hide map and street view, show media
		 * */
		$('.virtual-tour-block button').click(function(e) {
			toggleMedia.call(this);
		});

		$('#media-close-button').on('click', function (e) {

			e.preventDefault();

			var ele = $('.virtual-tour-block button.undo');

			toggleMedia.call(ele.parent().find('.media-button'), true);

			swapMediaAndMap({ doThis: 'showMap', ele: ele });

		});

		$(window).load(function () {
			// swap the src and data-src attribute on iframe media. Allows us to reset media
			$('.media iframe').each(function (index, val) {
				var src = $(val).attr('src');
				$(val).data('src', src);
				$(val).attr('src', '');
			});

			$('.virtual-tour-block').each(function (index, val) {
				$(val).find('input').data('index', index + 1);
			});
		});
	};

	var swapMediaAndMap = function (args) {
		var parentDiv = args.ele && args.ele.parents('.button-group');

		if (args.doThis === 'showMap' && args.ele) {
			// Hide the undo button
			parentDiv.find('.undo').removeClass('active');

			// Show Media button
			parentDiv.find('.media-button').addClass('active');

			// FadeIn the map
			if (!args.reset) {
				$('.map-reduce, .street-view-reduce').fadeIn(800);

				$('.media').removeClass('is-visible');

				$('.street-view-reduce').removeClass('hidden');
				$('.map-reduce').removeClass('hidden');
			}

			// Show main content on small screens
			$('.smallScreen').show();

		} else if (args.doThis === 'hideMap') {
			// Show the undo button
			parentDiv.find('.undo').addClass('active');

			// Hide media button
			parentDiv.find('.media-button').removeClass('active');

			// FadeOut map
			$('.map-reduce, .street-view-reduce').fadeOut(300, function () {
				$(this).hide();

				$('.media').addClass('is-visible');

				$('.street-view-reduce').addClass('hidden');
				$('.map-reduce').addClass('hidden');
			});

			// Hide main content on small screens
			$('.smallScreen').hide();
		}

		$('.media iframe').each(function (index, val) {
			var src = $(val).attr('src');
			if (src) {
				$(val).data('src', src);
				$(val).attr('src', '');
			}
		});

		if (chapman.virtualtour.Map.chapmanMap) {
			google.maps.event.trigger(chapman.virtualtour.Map.chapmanMap, 'resize');
		}

	};

	var removeOrAddMarkers = function (destination, e) {

		var selector;
		var antiSelector;
		var isVirtualTour;
		var markerObjects = [];
		var marker;

		var innerAction = function(sel, callback) {
			$(sel).each(function (index, value) {
				var name;

				if (sel === '.virtualTour-categoryCheckbox.parent') {
					name = $(value).attr('name');

					$(':checkbox[name=' + name + ']').each(function (innerIndex, innerValue) {
						var checkbox = $(innerValue);
						var marker;

						if ($(innerValue).prop('checked') || innerValue.checked) {
							// loop through all of the checkboxes and create marker objects to send off to the map
							if (checkbox.data().longitude && checkbox.data().latitude || checkbox.data().kmlUrl) {
								marker = chapman.virtualtour.CategoryMenu.createMarkerObject(checkbox);
								markerObjects.push(marker);
							}
						}

					});

				} else {
					marker = chapman.virtualtour.CategoryMenu.createMarkerObject($(value));
					if (marker.id) {
						markerObjects.push(marker);
					}
				}

			});

			return callback();
		};

		if (destination === 'virtualTour') {
			selector = '.locations li input';
			antiSelector = '.virtualTour-categoryCheckbox.parent';
			isVirtualTour = true;
		} else {
			selector = '.virtualTour-categoryCheckbox.parent';
			antiSelector = '.locations li input';
			isVirtualTour = false;
		}

		chapman.virtualtour.CategoryMenu.checkboxChanged(e);

		innerAction(selector, function() {
			return chapman.virtualtour.Map.addMarkers(markerObjects, isVirtualTour);
		});

		markerObjects = [];

		innerAction(antiSelector, function () {
			return chapman.virtualtour.Map.removeMarkers(markerObjects, isVirtualTour);
		});

	};

	var toggleMedia = function (closeButton) {

		var undo = $('.virtual-tour-block button.undo');
		var id = $(this).data('id');
		var mediaType = $(this).data('type');
		var nonMedia;

		if (closeButton) {
			if (mediaType === 'audio') {
				mediaType = '.video';
				nonMedia = '.audio';
			} else if (mediaType === 'video') {
				mediaType = '.audio';
				nonMedia = '.video';
			}
		} else if (mediaType === 'video') {
			mediaType = '.video';
			nonMedia = '.audio';
		} else if (mediaType === 'audio') {
			mediaType = '.audio';
			nonMedia = '.video';
		}

		if ($(this).hasClass('undo')) {
			swapMediaAndMap({ doThis: 'showMap', ele: $(this) });
		} else {
			// Reset any already open media
			swapMediaAndMap({ doThis: 'showMap', ele: undo, reset: true });
			swapMediaAndMap({ doThis: 'hideMap', ele: $(this) });

			$('.media-block').each(function (index, val) {

				var $val = $(val);
				var iframe;
				var src;
				var nonIframe;

				if ($val.data('id') === id) {

					$val.find('.video, .audio').each(function (index, val) {

						iframe = $(this).find('iframe');
						src = iframe.data('src');

						if (!iframe.attr('src')) {
							iframe.attr('src', src);
						}

					}).promise().done(function () {

						nonIframe = $val.find(nonMedia).find('iframe');
						nonIframe.attr('src', '');

						$val.find(mediaType).show();
						$val.find(nonMedia).hide();

					});

				} else {
					$val.find(mediaType).hide();
					$val.find(nonMedia).hide();

					$val.find(mediaType).find('iframe').attr('src', '');
					$val.find(nonMedia).find('iframe').attr('src', '');
				}

			});

		}

	};

	var switchPanels = function (e) {

		var target = $(e.target);

		// jMenu plugin hamburger trigger
		if (!$('#js-hamburger').hasClass('is-active')) {
			$('#js-hamburger').addClass('is-active');
		}

		// jMenu plugin
		if (!$('#js-jmenu--slide-left').hasClass('is-active')) {
			$('#js-jmenu--slide-left').addClass('is-active');
		}

		if (target.hasClass('tour')) {

			window.location.hash = '#virtual-tour';

			$('#virtualTour-mapBtn').attr('data-active', 'false');
			$('#virtualTour-tourBtn').attr('data-active', 'true');

			$('#virtualTour-tourBtn').addClass('primary');
			$('#virtualTour-mapBtn').removeClass('primary');

			$('#virtualTour-mainNavigation').hide();
			$('#virtualTour-panel').show();

			removeOrAddMarkers('virtualTour', e);

		} else if (target.hasClass('map')) {

			window.location.hash = '#campus-map';

			$('#virtualTour-mapBtn').attr('data-active', 'true');
			$('#virtualTour-tourBtn').attr('data-active', 'false');

			$('#virtualTour-mapBtn').addClass('primary');
			$('#virtualTour-tourBtn').removeClass('primary');

			var ele = $('.virtual-tour-block button.undo');

			$('#virtualTour-mainNavigation').show();
			$('#virtualTour-panel').hide();

			removeOrAddMarkers('map', e);

			swapMediaAndMap({ doThis: 'showMap', ele: ele, reset: false });

		}

	};

	return {
		switchPanels: switchPanels,
		registerListeners: registerListeners,
		removeOrAddMarkers: removeOrAddMarkers
	};

})(window.jQuery, window);
