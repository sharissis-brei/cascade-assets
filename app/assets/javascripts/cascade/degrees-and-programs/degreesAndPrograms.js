/*global window:false */
/*global $:false */
/*jslint plusplus: true */

var chapman = chapman || {};

(function ($, Modernizr, window, document) {

	'use strict';

	var chapmanHeader = $('.bigMasthead header:first-of-type'),
		headerShown = false;

	chapman.degreesAndPrograms = {

		init: function () {

			this.bindUIEvents();
			this.initGenieHeader();
			this.initTruncations();

			// if (chapmanHeader.length > 0) {
			// 	this.setGenieHeaderMargin();
			// }

		},

		bindUIEvents: function () {

			$(window).on('scroll resize', function () {

				if (!headerShown) {
					chapman.degreesAndPrograms.initGenieHeader();
				}

			});

			$('.results-views li').on('click', function () {
				chapman.degreesAndPrograms.switchResultsView($(this));
			});

			$('.dap-results').on('click', '.active-content-toggle', function () {
				$(this).closest('.result').toggleClass('active');
			});

			$('#js-dap-undergraduate-interests .show-more a').on('click', function () {
				$('#js-dap-undergraduate-interests').addClass('show-all');
			});

		},

		setGenieHeaderMargin: function () {
			var height = chapmanHeader.outerHeight(true);
			$('body').css('margin-top', -(height));
		},

		initGenieHeader: function () {
			var scrollPosition = $(window).scrollTop(),
				scrollThreshhold = 15;
			
			if (chapmanHeader.length > 0) { // If the Chapman header is present...

				if (scrollPosition > scrollThreshhold) { // Hide it until the user scrolls down a bit
					$('body').css('margin-top', '').addClass('scrolled');
					headerShown = true;
				}

			} else {
				$('body').addClass('scrolled'); // Otherwise show it
			}

		},

		initTruncations: function () {

			$('.result .result-content .desc').dotdotdot({
				watch: true
			});

			$('.result .active-content-inner').dotdotdot({
				watch: true,
				after: 'a'
			});

		},

		switchResultsView: function (el) {
			var viewButton = el,
				newView = viewButton.data('view'),
				results = viewButton.closest('.dap-results');

			if (!(viewButton.hasClass('active'))) {

				viewButton.closest('.results-views').find('li').removeClass('active');
				viewButton.addClass('active');

				if (newView === 'grid-view') {
					results.removeClass('list-view').addClass('grid-view');
				} else if (newView === 'list-view') {
					results.removeClass('grid-view').addClass('list-view');
				}

			}

		}

	};

})(window.jQuery, window.Modernizr, window, window.document);

$(function () {

	'use strict';

	chapman.degreesAndPrograms.init();

});