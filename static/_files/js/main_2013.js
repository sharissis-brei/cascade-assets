'use strict';

/* global BREI, _gaq */

var chapman = chapman || {};
var main = chapman.main || {};
var shortcuts = chapman.shortcuts || {};

(function ($, Modernizr, window, document)
{
    /**
     * Shortcuts
	 */

	// template for a favorite item
	shortcuts.favoriteItem = '<li><a href="{url}" title="{title}" class="shortcut">{title}</a><a href="{url}" title="Remove {title} from favorites" class="hide-text btn-removeShortcut">Remove</a></li>';

	shortcuts.init = function()
	{
		// remove buttons
		$('.btn-removeShortcut').click(function()
		{
			var url = window.location.href;
            var favorites = BREI.Personalization.getFavorites();

            for(var i=0; i<favorites.length;i++)
            {
                if(favorites[i].url === url){
                    favorites.splice(i, 1);                   
                }
            }

            BREI.Personalization.setFavorites(favorites);
            

            $('#welcome .control-links .save-btn, #welcome .control-links .unsave-btn').toggleClass('showme');

            shortcuts.loadFavorites();
            shortcuts.rebuildPager();

			return false;
		});

		// save button
        $('#btn-addThisPage').click(function() 
        {
            var url = window.location.href;
            var isFavorite = BREI.Personalization.has(url);
            var sub = document.title;
            //var title = sub.substring(sub.indexOf('|') + 2, sub.length)
            var title = sub;

            if(isFavorite)
            	shortcuts.removeFavorite(url);
            else
            	BREI.Personalization.pushToFavorites(url, title);

            _gaq ? _gaq.push(['_trackEvent', 'welcomeback', 'save', 'page', url]) : '';

            shortcuts.buildFavoritesList();

            return false;
        });

		shortcuts.buildFavoritesList();
	};

	shortcuts.toggleAddButton = function()
	{
        var isFavorite = BREI.Personalization.has(window.location.href);

        if(isFavorite)
        	$('#btn-addThisPage').addClass('is-favorite').html('Remove this page');
        else
        	$('#btn-addThisPage').removeClass('is-favorite').html('Add this page');
	};

	/**
	 * Builds the list under the shortcuts menu
	 */
	shortcuts.buildFavoritesList = function()
	{
		var faves = BREI.Personalization.getFavorites();
		var $favoritesList = $('#favoritesList').html('');

		if (faves.length != 0 && faves[0] != null) 
		{
			for (var i in faves)
			{
				var title = faves[i].sub;
				var url = faves[i].url;
				var li = t(shortcuts.favoriteItem, {
					title: title,
					url: url
				});
            	$favoritesList.append(li);
            }
		}

		$('.btn-removeShortcut').click(function()
		{
			var url = $(this).attr('href');
			shortcuts.removeFavorite(url);
			return false;
		});

		shortcuts.toggleAddButton();
	};

	/**
	 * Removes the provided URL
	 */
	shortcuts.removeFavorite = function(url)
	{
		var favorites = BREI.Personalization.getFavorites();

		for(var i = 0; i < favorites.length; i++)
		{
            if(favorites[i].url === url)
            {
                favorites.splice(i, 1);
                BREI.Personalization.setFavorites(favorites);
            }
        }

        shortcuts.buildFavoritesList();
	};

	/** 
	 * Main
	 */
	main.mainInit = function()
	{
		main.ui();

		$('.footer-links-group > h3').click(function()
		{
			$(this).parent().toggleClass('is-visible');
		});
	};

	main.ui = function()
	{
		var $visibleUi;
		var $body = $('body');

        function documentTap(e)
	    {

	    	if(!$(e.target).hasClass('resources-nav-btn'))
	    	{
		    	var $target = $(e.target);
		    	var $parents = $target.parents('.resources-subNav');
		    	var $audienceNav = $target.parents('.infoFor-menu');

		    	if($visibleUi !== undefined) {
		    		if($audienceNav.length === 0 && $parents.length === 0 && $visibleUi && $visibleUi[0] !== $target[0])
		        		hideUi(e);
		        }
		    }
	    }

	    $body.on('click touchstart', function(e)
    	{
    		documentTap(e);
    	});

	    function hideUi(e)
	    {
	    	if($visibleUi)
	        	$visibleUi.removeClass('is-visible');

	        $('.resources-nav-btn').removeClass('is-active');

	        $visibleUi = null;
	    }

	    function isSame($el)
	    {
	    	var isSame = false;

	    	if($visibleUi)
	    	{
	    		if($el[0] === $visibleUi[0])
	    			isSame = true;
	    	}

	    	return isSame;
	    }

	    function toggleUi($el, e)
	    {
	    	var isVisible = $el.hasClass('is-visible') ? true : false;

	    	if($visibleUi)
	    	{
	    		if($el[0] !== $visibleUi[0])
	    			hideUi();
	    	}

	        $visibleUi = $el;

	        if(!isVisible)
	        {
	            $el.addClass('is-visible');

	            if(e != undefined)
	            {
	            	$(e.currentTarget).addClass('is-active');
	            }
	        }
	        else
	        {
	            $el.removeClass('is-visible');
	            if(e != undefined)
	            {
	            	$(e.currentTarget).removeClass('is-active');
	            }
	            $visibleUi = null;
	        }
	    }

		/**
	     * Main Nav li:hover show/hide subNav
	     */
	    if(!Modernizr.csstransitions)
	    {
		    $('.mainNavLinks .has-dropdown').hoverIntent(
	            function() 
	            {
	                $(this).children('.subNavLinks').addClass('is-visible');
	            },
	            function() 
	            {
	                $(this).children('.subNavLinks').removeClass('is-visible');
	            }
	        );
		}

	    /**
	     * Resources nav li:hover show/hide subNav
	     */
	    $('.resources-nav .resources-nav-btn').click(function(e)
	    {
	    	var toggle = $(this).parent().children('div');
	        toggleUi(toggle, e);

	        return false;
	    });

	    /**
	     *
	     */
	    $('#infoFor-btn').click(function()
	    {
	    	var toggle = $(this).parent('div').children('.infoFor-menu');
	        
	        if(!isSame(toggle))
	        	toggleUi(toggle);

	        return false;
	    });

	    /**
		 * enables the fancy triangle rollover 
		 */
		$('#mainNavLinks li:first').hover(function() {
	        $('#mainNavLinks').addClass('active');
	    }, function () {
	        $('#mainNavLinks').removeClass('active');
	    });
	};

	$(function()
	{
		main.mainInit();
		shortcuts.init();
	});    

})(window.jQuery, window.Modernizr, window, window.document);

/***************************************************
* This code watches what the user types into our search field
* and displays a helpful tooltip if they are looking for Blackboard
* or Webadvisor
***************************************************/
(function ($) {
	// Run when the page is ready
	$(document).ready(function () {
		cu_search_helper.initialize();

		cu_search_autofocus.initialize();
	});

	var
	keyCodes = {
		'search': 191
	},
	focusableElements = /a|button|input|option|select|textarea/i,
	$elements = {
		btnSearch: $('a.resources-nav-btn-search'),
		navSearch: $('div.resources-subNav-search'),
		inpSearch: $('#smallSearchBox')
	},
	cu_search_autofocus = {
		initialize: function () {
			$(window).on('keydown', function (event) {
				if (!cu_search_autofocus.elementSupportsFocus(document.activeElement) && event.keyCode === keyCodes.search) {
					event.preventDefault();

					cu_search_autofocus.openSearch();
					cu_search_autofocus.focusSearch();
				}
			});

			$elements.btnSearch.on('click', cu_search_autofocus.focusSearch);
		},
		focusSearch: function () {
			$elements.inpSearch.focus();
		},
		openSearch: function () {
			$elements.btnSearch.addClass('is-active');
			$elements.navSearch.addClass('is-visible');
		},
		elementSupportsFocus: function (element) {
			return element.nodeName.match(focusableElements) || element.hasAttribute('tabindex');
		}
	},
	cu_search_helper = {
		tooltip_visible: false,

		initialize: function () {

			// Do not run this object on small viewports
			if ($(window).width() < 780) return false;

			// Run this each time they type a letter
			$('#smallSearchBox').on('keyup', function() {

				var query_substring = $(this).val().substring(0,3).toLowerCase();

				if (query_substring === 'bla') {
					cu_search_helper.showHelpfulTip('Blackboard');
				} else if (query_substring === 'web') {
					cu_search_helper.showHelpfulTip('WebAdvisor');
				} else {
					cu_search_helper.hideHelpfulTip();
				}

			});
		},

		// Show the tooltip
		showHelpfulTip : function(serviceName) {
			if (this.tooltip_visible) return false;

			this.tooltip_visible = true;
			// Add overlay
			$('<div id="cuNavBarMasks"><div class="mask_1"></div><div class="mask_2"></div></div>').prependTo($('.resources-subNav-search')).hide().fadeIn(600);

			// Add a tooltip
			$('<div id="cuSearchHelper"><span class="title">Looking for <b>'+serviceName+'</b>?</span><br /><span class="label">We added a faster way to find our web services. </span></div>').prependTo($('.resources-subNav-search')).hide().slideDown(300);

			$('.resources-subNav-search').addClass('show-helper');

			// Hide Google autocomplete
			$('.gssb_c').hide();
			setTimeout(function() {
				$('.gssb_c').hide();
			}, 300);

		},

		// Hide the tooltip
		hideHelpfulTip : function() {
			if (!this.tooltip_visible) return false;

			this.tooltip_visible = false;

			// Remove the tooltip
			$('.resources-subNav-search').removeClass('show-helper');

			$('#cuSearchHelper').slideUp(300,function() { 
				$('#cuSearchHelper').remove(); 
			});

			// Remove the overlay
			$('#cuNavBarMasks').fadeOut(300,function() { 
				$('#cuNavBarMasks').remove(); 
			});

		}
	};
})(this.jQuery);
