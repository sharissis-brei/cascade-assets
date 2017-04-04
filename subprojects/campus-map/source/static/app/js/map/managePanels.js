/* global window */
/* global chapman:false */

/**
 * ManagePanels
 * Send all requests to change the state of the panels through this class. 
 */

chapman.virtualtour.ManagePanels = (function ($, window) {

	'use strict';

	var SEARCH_OPEN_CLASS_NAME = 'searchOpen',
		CATEGORY_MENU_OPEN_CLASS_NAME = 'categoryMenuOpen',
		STATE_DEFAULT = 'default',
		// STATE_MAP = 'map',
		STATE_MAP_DETAIL = 'mapDetail',
		// STATE_TOUR = 'tour',
		// STATE_SEARCH = 'search',
		_state = STATE_DEFAULT;

	var _navigation;

	var _init = function() {

		_navigation = $('#virtualTour-mainNavigation');

		if ($('#virtualTour-categoryMenu').is(':visible')) {
			$('#virtualTour-categoryMenu').show();
		}

		if ($('#virtualTour-search').is(':visible')) {
			$('#virtualTour-search').show();
		}

		$(window).resize(function () {
			adjustMapHeight();
		});

		$(window).load(function () {
			adjustMapHeight();
		});

	};

	var adjustMapHeight = function () {

		$('.map-reduce').css('height', function () {

			var containerHeight = $('.map-container').css('height');

			if (containerHeight) {
				containerHeight = containerHeight.replace('px', '');
				return containerHeight;
			}

		});

	};

	var _toggleCategoryMenu = function() {

		if (_navigation.hasClass(CATEGORY_MENU_OPEN_CLASS_NAME)) {

			// _hideCategoryMenu();
		
		} else {

			_navigation.addClass(CATEGORY_MENU_OPEN_CLASS_NAME);

			$('#virtualTour-categoryMenu').slideDown();

			_hideDetail();

			$('#virtualTour-searchResults').slideUp();

		}

		chapman.virtualtour.MainNavigation.updateMainMenu('categoryMenu');

	};

	var _hideCategoryMenu = function() {

		_state = STATE_DEFAULT;
		_navigation.removeClass(CATEGORY_MENU_OPEN_CLASS_NAME);

		$('#virtualTour-categoryMenu').slideUp();

	};

	var _showCategoryMenu = function() {

		_navigation.addClass(CATEGORY_MENU_OPEN_CLASS_NAME);

		$('#virtualTour-categoryMenu').slideDown();

	};

	var _toggleSearch = function() {
		_hideCategoryMenu();

		if (!_navigation.hasClass(SEARCH_OPEN_CLASS_NAME)) {

			_navigation.addClass(SEARCH_OPEN_CLASS_NAME);

			$('#virtualTour-search').slideDown();

		}

		chapman.virtualtour.MainNavigation.updateMainMenu('search');

	};

	var _hideSearch = function() {

		_navigation.removeClass(SEARCH_OPEN_CLASS_NAME);

		$('#virtualTour-search').slideUp();

	};

	var _showSearch = function() {

		_navigation.addClass(SEARCH_OPEN_CLASS_NAME);

		$('#virtualTour-search').slideDown();
		$('#virtualTour-searchResults').slideDown();

	};

	// CHAPWEB-1165 - sstacho
	var _showDetail = function (contentId) {

		var cb, // Checkbox
			detailHref, // Attraction content
			hash, // Location hash
			jqxhr, // jQuery promise
			lat, // Latitude
			lon, // Longitude
			tourDetail; // Attraction content panel

		var isDev = !/chapman\.edu/.test(window.location); // Is Dev?
		var protocol = window.location.protocol; // Location protocol
		var hostname = window.location.hostname; // Location hostname
		var ext = window.location.pathname.substr(window.location.pathname.lastIndexOf('.') + 1); // File extension

		 _state = STATE_MAP_DETAIL;

		// Close jMenu
		if ($('#js-jmenu--slide-left').hasClass('is-active')) {
			$('#js-jmenu--slide-left').removeClass('is-active');
		}

		// Find checkbox...
		cb = $('#virtualTour-categoryMenu').find('#' + contentId);

		// ...if empty
		if (!cb.length) {
			cb = $('.virtual-tour-block').find('#' + contentId);
		}

		// Hyperlink reference: Dev or production?
		if (isDev) {
			detailHref = cb.data().href;
		} else {
			if (ext.indexOf('.') > -1) {
				detailHref = protocol + '//' + hostname + cb.data().href + '.' + ext;
			} else {
				detailHref = protocol + '//' + hostname + cb.data().href + '.aspx';
			}
		}

		// Get location hash
		hash = window.location.hash;

		if (hash === '' || hash === '#') {
			return false;
		}

		// Cached selector
		tourDetail = $('#virtualTour-detail');

		// Update the Google Maps link
		lat = cb.data().latitude;
		lon = cb.data().longitude;

		// Empty content
		tourDetail.empty();

		jqxhr = $.ajax({
			url: detailHref,
			method: 'GET',
			dataType: 'html'
		});

		jqxhr.then(function (data, textStatus, jqXHR) {

			// Get location hash
			var hash = window.location.hash;

			if (hash === '' || hash === '#') {
				return false;
			}

			if (tourDetail.hasClass('is-active')) {
				tourDetail.removeClass('is-active');
			}

		});

		jqxhr.done(function (data, textStatus, jqXHR) {

			var bxslider;
			var bxAutoRotate;
			var bxSpeed;
			var bxStartSlide;
			var slider;
			var content = $(data).find('#virtualTour-attractionContent').html();

			// Empty content
			tourDetail.empty();

			// Load content
			tourDetail.html(content);

			// bxSlider
			if (textStatus === 'success') {

				if ($('#virtualTour-bxSlider').length > 0) {

					bxslider = $('#virtualTour-bxSlider').find('.bxslider');

					// bxSlider CMS customizations
					bxSpeed = bxslider.data().speed;
					bxAutoRotate = (bxslider.data().auto === 'On') ? true : false;
					bxStartSlide = bxslider.data().startSlide;

					if (bxslider.find('li').length > 0) {

						bxslider.find('li').each(function (index) {

							var src = $(this).data('src');
							var img = $(this).find('img');

							img.attr('src', src);

						});

					} else {

						bxslider.html('<li><img src="[system-asset]/_files/virtualTour/img/chapman_university_logo-placeholder.jpg[/system-asset]" alt="Chapman University" /></li>');

					}

					slider = $(bxslider).bxSlider({
						startSlide: bxStartSlide, // Starting slide index (zero-based)
						adaptiveHeight: true,
						pager: false,
						auto: bxAutoRotate, // Slides will automatically transition
						pause: bxSpeed, // The amount of time (in ms) between each auto transition
						onSliderLoad: function (currentIndex) {

							// "Previous" slide control
							$('.bx-prev')
								.empty()
								.attr('title', 'Previous slide')
								.attr('aria-label', 'Previous')
								.addClass('icon icon-chevron-left')
								.css({
									opacity: 1,
									visibility: 'visible'
								});

							// "Next" slide control
							$('.bx-next')
								.empty()
								.attr('title', 'Next slide')
								.attr('aria-label', 'Next')
								.addClass('icon icon-chevron-right')
								.css({
									opacity: 1,
									visibility: 'visible'
								});

						}
					});

					// If ".bx-prev" or ".bx-next" is clicked, resume the auto transition for bxSlider. - sstacho
					if (bxAutoRotate) {
						$('.bx-prev, .bx-next').on('click', function (e) {
							e.preventDefault();
							slider.startAuto();
						});
					}

				}

			}

			// Delay
			setTimeout(function () {
				return (!tourDetail.hasClass('is-open')) ? tourDetail.addClass('is-active') : null;
			}, 500);

		});

	};

	var _hideDetail = function () {
		var tourDetail = $('#virtualTour-detail');
		tourDetail.hide();
	};

	return {
		init: _init,
		toggleCategoryMenu: _toggleCategoryMenu,
		showCategoryMenu: _showCategoryMenu,
		hideCategoryMenu: _hideCategoryMenu,
		toggleSearch: _toggleSearch,
		showSearch: _showSearch,
		hideSearch: _hideSearch,
		showDetail: _showDetail,
		hideDetail: _hideDetail,
	};

})(window.jQuery, window);
