;(function (console, document, window, undefined) {

	'use strict';

	// Default options
	var defaults = {
    	overlay: true,
    	trigger: null,
        type: 'slide-left',
		beforeOpen: function () {},
		afterOpen: function () {},
		beforeClose: function () {},
		afterClose: function () {}
	};

	// http://youmightnotneedjquery.com/
	var extend = function(out) {
		out = out || {};
		for (var i = 1; i < arguments.length; i += 1) {
			if (!arguments[i]) {
				continue;
            }
			for (var key in arguments[i]) {
				if (arguments[i].hasOwnProperty(key)) {
					out[key] = arguments[i][key];
				}
			}
		}
		return out;
	};

	// Constructor
	function jMenu(options, callback) {

		this.elem = {};

		this.options = extend({}, defaults, options);
		this.callback = callback;

		this.init();

	}

	// Initialize
	jMenu.prototype.init = function () {

		// Overlay
		if (this.options.overlay) {
			this.overlay();
        }

		// Cached selectors
        this.elem.body = document.body;
		this.elem.mask = (this.options.overlay) ? document.querySelector('#jmenu-mask') : null;
        this.elem.menu = document.querySelector('#jmenu--' + this.options.type);
        this.elem.trigger = document.querySelector(this.options.trigger);

        this.bindUIActions();

		// Callback
		if (typeof this.callback !== 'undefined') {
			if (typeof this.callback === 'function') {
				this.callback.call(this);
			} else {
				throw Error(typeof this.callback + ' is not a function');
			}
		}

	};

    jMenu.prototype.bindUIActions = function () {

    	this.elem.trigger.addEventListener('click', function (event) {
        	this.toggleMenu(event);
        }.bind(this));

    	if (this.elem.mask !== null) {
            this.elem.mask.addEventListener('click', function () {
                this.closeMenu();
            }.bind(this));
        }

    };

    // Toggle menu
    jMenu.prototype.toggleMenu = function (event) {

    	event.preventDefault();

    	var target = event.target;

        if (target.classList.contains('is-active')) {
        	target.classList.remove('is-active');
        	this.closeMenu();
        } else {
        	target.classList.add('is-active');
        	this.openMenu();
        }

    };

    // Open menu
    jMenu.prototype.openMenu = function () {

    	// Callback: Before open
    	this.options.beforeOpen.call(this);

        if (this.options.overlay) {
        	this.elem.mask.classList.add('is-active');
        }

    	this.elem.body.classList.add('jmenu-is-active');
        this.elem.menu.classList.add('is-active');
        this.elem.trigger.classList.add('is-active');

        // Callback: After open
        this.options.afterOpen.call(this);

    };

    // Close menu
    jMenu.prototype.closeMenu = function () {

    	// Callback: Before close
        this.options.beforeClose.call(this);

        if (this.options.overlay) {
        	this.elem.mask.classList.remove('is-active');
        }

    	this.elem.body.classList.remove('jmenu-is-active');
        this.elem.menu.classList.remove('is-active');
        this.elem.trigger.classList.remove('is-active');

        // Callback: After close
        this.options.afterClose.call(this);

    };

	jMenu.prototype.overlay = function () {

		var div = document.createElement('div');

		div.id = 'jmenu-mask';
		div.className = 'jmenu-mask';

		document.body.appendChild(div);

	};

	window.jMenu = jMenu;

}(window.console, window.document, window));
