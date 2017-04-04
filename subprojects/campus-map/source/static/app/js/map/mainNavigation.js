/* global window */
/* global chapman:false */

/**
 * MainNavigation
 */

chapman.virtualtour.MainNavigation = (function ($, window) {

	'use strict';

	var enabled = false;
	var initialized = false;

	var _init = function() {

		if (!initialized) {

			$('#virtualTour-mainNavigationMenuButton button').click(_mainMenuClicked);

			$('#virtualTour-mainNavigationSearchButton button')
				.click(_mainMenuClicked)
				.focusout(function (e) {
					var input = $(this).parent().find('input');

					if (!input.val().length) {
						_mainMenuClicked(e);
					}

				});

			initialized = true;

		}

	};

	var _mainMenuClicked = function(e) {
		
		var curTarget = $(e.currentTarget).parent(),
			action = curTarget.data().action;

		switch (action) {
			case 'menu' : {
				chapman.virtualtour.ManagePanels.toggleCategoryMenu('menu');
				break;
			}
			case 'search' : {
				chapman.virtualtour.ManagePanels.toggleSearch('menu');
				break;
			}
		}

		return false;

	};

	/**
	 * Public functions
	 */

	var _updateMainMenu = function(action) {

		if (!enabled) {
			$('#virtualTour-mainNavigation').show();
			enabled = true;
		}

		switch (action) {
			case 'categoryMenu': {
				$('#virtualTour-mainNavigationMenuButton').toggleClass('active');
				$('#virtualTour-mainNavigationSearchButton').removeClass('active');
				break;
			}
			case 'search': {
				$('#virtualTour-mainNavigationMenuButton').removeClass('active');
				$('#virtualTour-mainNavigationSearchButton').toggleClass('active');
				break;
			}
			case 'detail': {
				$('#virtualTour-mainNavigationMenuButton').removeClass('active');
				$('#virtualTour-mainNavigationSearchButton').removeClass('active');
				break;
			}
			default: {
				$('#virtualTour-mainNavigationMenuButton').removeClass('active');
				$('#virtualTour-mainNavigationSearchButton').removeClass('active');
			}
		}

		return false;

	};

	return {
		init: _init,
		updateMainMenu: _updateMainMenu
	};

})(window.jQuery, window);
