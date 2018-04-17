var messaging = {};

(function ($, document, window) {

	'use strict';

	messaging.select = {

		speed: 200,

		elem: {
			$trigger: null
		},

		init: function () {

			// Cached selectors
			this.elem.$trigger = ($('.select').length > -1) ? $('.select') : null;

			if (this.elem.$trigger !== null) {
				this.bindUIActions();
			}

		},

		bindUIActions: function () {

			// Delegated events
			this.elem.$trigger.on('click', '.select-button', this.toggle.bind(this));

			this.elem.$trigger.on('hover', '.select-list li', this.highlight.bind(this));

			$(document).on('click', this.close.bind(this));

		},

		close: function (e) {

			var $button = this.elem.$trigger.find('.select-button');
			var $list = $button.parent().find('.select-list');

			if (!$button.is(e.target) && $button.has(e.target).length === 0) {
				$list.slideUp(this.speed);
			}			

		},

		highlight: function (e) {
			$(e.target).addClass('selected').siblings('.selected').removeClass('selected');
		},

		toggle: function (e) {

			var $target = $(e.target);

			$target.toggleClass('active');
			$target.parent().find('.select-list').slideToggle(this.speed);

		}

	};

}(window.jQuery, window.document, window));

$(document).ready(function () {

	'use strict';

	messaging.select.init();

});