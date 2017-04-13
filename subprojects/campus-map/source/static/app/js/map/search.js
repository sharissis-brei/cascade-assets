/* global window */
/* global chapman:false */

chapman.virtualtour.Search = (function ($, window) {

	'use strict';

	var _init = function () {

		$('#virtualTour-searchField').on('keyup', function (e) {

			var li = 0,
				searchResult = '',
				searchResults = '',
				temp = [],
				text = $('#virtualTour-searchField').val();

			if (text && text.length >= 0) {

				chapman.virtualtour.ManagePanels.showSearch();
				chapman.virtualtour.ManagePanels.hideCategoryMenu();

				$('#js-reset').addClass('is-active');

				$('.virtualTour-subCategory[data-search-terms*="' + text.toLowerCase() + '"]').each(function (index, value) {

					var anchor,
						elem,
						title,
						href,
						id;

					if ($(value).hasClass('virtual-tour-block')) {

						anchor = $('.go-to-info', value);
						title = anchor.text() + ' (Virtual Tour Listing)';
						href = anchor.attr('href');
						id = anchor.data().id;

					} else {

						elem = $(value);
						title = elem.find('.virtualTour-categoryCheckboxLabel span').text();
						href = elem.find('.virtualTour-categoryCheckbox.child').data().href;
						id = elem.find('.virtualTour-categoryCheckbox.child').attr('id');

					}

					if (temp.indexOf(title) === -1) {
						li += 1;
						searchResult = '<li class="virtualTour-searchResult"><a href="' + href + '" data-checkbox-id="' + id + '">' + title + '</a></li>';
						searchResults += searchResult;
						temp.push(title);
					}

				});

				$('#virtualTour-searchResultsList').empty().append(searchResults);
				$('#virtualTour-numItems').text(li);

				$('.virtualTour-searchResult a', '#virtualTour-searchResultsList').on('click', function (e) {
					chapman.virtualtour.CategoryMenu.subCategoryClicked(e);
				});

			} else {

				chapman.virtualtour.ManagePanels.hideSearch();
				chapman.virtualtour.ManagePanels.showCategoryMenu();

				$('#js-reset').removeClass('is-active');
				$('#virtualTour-searchResultsList').empty();
				$('#virtualTour-numItems').text(0);

			}

		});

		$('#js-reset').on('click', function (e) {

			e.preventDefault();

			if ($('#virtualTour-searchField').length > 0) {
				$('#virtualTour-searchField').val('');
			}

			$('#virtualTour-searchField').trigger('keyup');

		});

	};

	return {
		init: _init
	};

}(window.jQuery, window));