/* global window */
/* global $ */
/* global chapman:false */

chapman.virtualtour.OmniNav = (function ($, window) {

	'use strict';

	var _init = function _init() {

		_sinkLinkWidths();

		_bindUIActions();

	};

	var _bindUIActions = function _bindUIActions() {

		$('#js-cu-off-canvas-nav-trigger, #js-cu-close-off-canvas-nav, #js-cu-off-canvas-overlay').on('click', function (event) {

			event.preventDefault();
			
			$('#js-cu-off-canvas-nav-container').toggleClass('open');
			
			$('#js-cu-off-canvas-overlay').toggleClass('active');
		
			$('body').toggleClass('no-scroll');
		
		});

		$('#js-cu-off-canvas-nav-container .toggle').on('click', function () {

			$(this).parent().toggleClass('open'); // Targets li
			
			$(this).parent().find('ul').slideToggle();
		
		});

		$(window).on('resize', function () {

			_sinkLinkWidths();

		});

	};

	var _sinkLinkWidths = function _sinkLinkWidths() {

		var width = $('#js-cu-off-canvas-nav > ul').width();

		$('#js-cu-off-canvas-nav > ul > li > a').css('width', width);

	};

	return {
		init: _init
	};

})(window.jQuery, window);


$(function () {

	'use strict';

	chapman.virtualtour.OmniNav.init();

});