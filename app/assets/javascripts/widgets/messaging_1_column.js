/*
 * messaging_1_column.js
 *
 * The following module (Messaging1Column), or object, is used to define
 * features and logic used within the messaging 1-column widgets: 
 * "Text Widget", "Text with Image Widget" and "Text with Video Widget".
 */

var Messaging1Column = Messaging1Column || {};

(function ($, document, window) {

  'use strict';

  Messaging1Column.select = {

    speed: 200,

    elem: {
      $trigger: null
    },

    init: function () {

      // Cached selectors
      this.elem.$trigger = ($('.text-widget-select').length > -1) ? $('.text-widget-select') : null;

      if (this.elem.$trigger !== null) {
        this.bindUIActions();
      }

    },

    bindUIActions: function () {

      // Delegated events
      this.elem.$trigger.on('click', '.select-button', this.toggle.bind(this));

      $(document).on('click', this.close.bind(this));

    },

    close: function (e) {

      var $button = this.elem.$trigger.find('.select-button');
      var $list = $button.parent().find('.select-list');

      if (!$button.is(e.target) && $button.has(e.target).length === 0) {
        $list.slideUp(this.speed);
      }

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

  Messaging1Column.select.init();

});
