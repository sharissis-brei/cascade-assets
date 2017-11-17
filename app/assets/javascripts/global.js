/*
 * global.js

 * Include in this file any javascript meant be run globally. That is, for any page on
 * document ready.
 *
 * This file models the new (as of 2017) preferred pattern we'd like to use for Javascript.
 * It follows jQuery documentation here:
 *
 * https://learn.jquery.com/using-jquery-core/document-ready/
 *
 * For more information on best practices, see: https://kb-smc.chapman.edu/?p=1796
 *
 * See also app/assets/javascripts/cascade/main.js
 */
var globalLoader = (function() {

    // Constants

    // Global Attrs: undefined values will be set on document ready.
    var $omninav = undefined;
    var omninavPresent = undefined;
    var omninavHeight = undefined;

    // Public Methods
    var initOnDocumentReady = function() {
        // Set undefined globals.
        $omninav = $('#cu_nav');
        omninavPresent = $omninav.length > 0;
        omninavHeight = omninavPresent ? $omninav.outerHeight() : null;

        // Init events.
        repositionAnchorLinksToOffsetOmniNav();
    }

    // Private Methods
    var repositionAnchorLinksToOffsetOmniNav = function() {
        // Only apply this when omninav is present.
        if ( ! omninavPresent ) {
            return false;
        }

        // Unfortunately, there isn't a uniform identifier that can be referenced throughout
        // the site at this time. So we have to cover a few cases.
        var $wysiwygLinks = $('h3.anchorLinks a, a[href="#top"]');
        var $azLinks = $('div.a-z-widget a');

        // Callback to reposition anchors on click.
        var repositionAnchorsOnClick = function(e) {
            // Pull anchor identifer from URL hash.
            var anchorIdentifer = this.hash.slice(1);

            // Identify target element. It could be a name or id attr.
            var nameSelector = 'a[name=' + anchorIdentifer + ']';
            var idSelector = '#' + anchorIdentifer;

            // Look first for name selector.
            var $target = $(nameSelector);

            // If no name selector, look for ID selector.
            if (!$target.length) {
                $target = $(idSelector);
            }

            if ( $target.length ) {
                e.preventDefault();
                var newTopPosition = $target.offset().top - omninavHeight;
                $("body, html").animate({scrollTop: newTopPosition});
            }
        }

        $wysiwygLinks.on('click', repositionAnchorsOnClick);
        $azLinks.on('click', repositionAnchorsOnClick);
    }

    // Public API
    return {
        init: initOnDocumentReady
    };
})();

$(document).ready(function() {
    if ( $('html').find('#omni-nav-v2').length === 0 ){
        globalLoader.init();
    }
});
