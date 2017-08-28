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
			var _this = this;

			this.bindUIEvents();

			setTimeout(function() {
				_this.setGenieHeaderOffset();
			}, 100);

			this.genieHeader();

		},

		bindUIEvents: function () {
			var _this = this;

			$(window).on('resize', function () {

				if (!headerShown) {
					_this.setGenieHeaderOffset();
				}

			}).on('scroll', function () {

				if (!headerShown) {
					_this.genieHeader();
				}

			});

			$('.results-views li').on('click', function () {
				chapman.degreesAndPrograms.switchResultsView($(this));
			});

			$('.dap-results').on('click', '.active-content-toggle', function (event) {
				event.preventDefault();
				$(this).closest('.result').toggleClass('active');
			});

			$('#js-dap-undergraduate-interests .show-more a').on('click', function () {
				$('#js-dap-undergraduate-interests-list').addClass('show-all');
			});

		},

		// Sets the initial offset that hides the header
		setGenieHeaderOffset: function () {

			if (chapmanHeader.length > 0) {
				var height = chapmanHeader.outerHeight(true);
				$('body').css('margin-top', -(height)).addClass('ready');
			}
			
		},

		// Shows the header after the user has scrolled
		genieHeader: function () {
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