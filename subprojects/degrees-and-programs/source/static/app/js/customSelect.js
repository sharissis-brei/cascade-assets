/*global window:false */
/*global $:false */
/*jslint plusplus: true */

var chapman = chapman || {};

(function ($, Modernizr, window, document) {

	'use strict';

	var selectContainerSelector = $('.custom-select-container'),
		// selectOptionsSelector = $('.custom-select-options'),
		// selectInputSelector = $('.custom-select-input'),
		openClass = 'open',
		optionsTransitionTime = 450;

	chapman.customSelect = {

		init: function () {

			this.initCustomSelectOptions();
			this.bindUIEvents();

		},

		bindUIEvents: function () {

			$('html, body').on('click', function (event) {

				if ($(event.target).closest('.custom-select-container').length === 0) {
					$('.custom-select-input').removeClass(openClass);
					$('.custom-select-options').removeClass(openClass).slideUp(optionsTransitionTime);
					$('.custom-select-container').removeClass('custom-select-options-visible');
				}

			});

			// Focus function to show the custom select options
			selectContainerSelector.on('click', '.custom-select-input', function () {
				var customOptions = $(this).parent().find('.custom-select-options');
				
				if ($(this).hasClass(openClass)) { // If already open, close the options
					$(this).removeClass(openClass);
					$(this).closest('.custom-select-container').removeClass('custom-select-options-visible');
					customOptions.removeClass(openClass).slideUp(optionsTransitionTime);
				} else { // Otherwise open the options
					$(this).addClass(openClass);
					$(this).closest('.custom-select-container').addClass('custom-select-options-visible');
					$('.custom-select-input').not($(this)).removeClass(openClass);
					$('.custom-select-container select').not($(this)).parent().find('.custom-select-options').removeClass(openClass).slideUp(optionsTransitionTime);
					customOptions.addClass(openClass).slideDown(optionsTransitionTime);
				}
				
			});

			// Selection and syncing of custom select options
			selectContainerSelector.on('click', '.custom-select-options li', function () {
				chapman.customSelect.changeSelectOption($(this));
			});

			$('.custom-select-container').on('change', 'select', function (event) {
				chapman.customSelect.syncCustomSelect($(this));
			});

		},

		initCustomSelectOptions: function () {

			selectContainerSelector.each(function () {
				var optionsHTML = '',
					select = $(this).find('select'),
					selectID = select.attr('id'),
					selectValue = select.find('option:selected').text();

				// Find all the options
				select.find('option').each(function () {
					var value = $(this).val(),
						text = $(this).text(),
						disabled = $(this)[0].disabled;

					// Use them only if they aren't disabled
					if (!disabled) {
						optionsHTML = optionsHTML + '<li data-value="' + value + '">' + text + '</li>';
					}

				});

				// Append a list to be used as the options
				$(this).append('<div id="' + selectID + '-clone" class="custom-select-input" aria-label="Click to toggle options dropdown for ' + selectValue + ' select box"><span class="selected-value">' + selectValue + '</span></div><div class="custom-select-options" data-field-id="' + selectID + '"><ul>' + optionsHTML + '</ul></div>').addClass('custom-select-options-active');

			});

		},

		// Syncs select input when a custom select list item is clicked
		changeSelectOption: function (el) {
			var select = $(el).closest('.custom-select-container').find('select'),
				optionVal = $(el).data('value');

			select.val(optionVal).change(); // Force change event – this will trigger syncCustomSelect()

		},

		// Syncs custom select when a select input is changed (propagates from changeSelectOption())
		syncCustomSelect: function (select) {
			var val = $(select).val();
			var selectContainer = $(select).closest('.custom-select-container');
			var selectedOptionText = $(select).parent().find('.custom-select-options li[data-value="' + val + '"]').text();

			selectContainer.find('.custom-select-options li').removeClass('selected');
			selectContainer.find('.custom-select-options li[data-value="' + val + '"]').addClass('selected');
			selectContainer.find('.custom-select-options').removeClass(openClass).slideUp(optionsTransitionTime);
			selectContainer.find('.custom-select-input').removeClass(openClass);
			selectContainer.find('.custom-select-input .selected-value').text(selectedOptionText);

		},

		resetSelect: function (el) {
			var select = $(el),
				selectID = select.attr('id'),
				selectedValue = select.find('option:first').attr('selected', true).text();
			
			select.prop('selectedIndex', 0);
			$('#' + selectID + '-clone .selected-value').text(selectedValue);

		}

	};

})(window.jQuery, window.Modernizr, window, window.document);

$(function () {

	'use strict';

	chapman.customSelect.init();

});