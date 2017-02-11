/*
 * personnel.js
 *
 * Javascript associated specifically with personnel widget, which can be found on this page:
 *
 * https://www.chapman.edu/admission/undergraduate/contact-us/index.aspx
 */
var personnelWidget = (function() {

    // Constants

    // Global Attrs: undefined values will be set on document ready.
    var $omninav = undefined;
    var omninavPresent = undefined;
    var omninavHeight = undefined;
    var $personnelListingWidget = undefined;
    var personnelListingWidgetPresent = undefined;
    var urlHashFragment = undefined;

    // Public Methods
    var initOnDocumentReady = function() {
        // Set undefined globals.
        $omninav = $('#cu_nav');
        omninavPresent = $omninav.length > 0;
        omninavHeight = omninavPresent ? $omninav.outerHeight() : null;

        $personnelListingWidget = $('div.personnel-listing-widget');
        personnelListingWidgetPresent = $personnelListingWidget.length > 0;

        urlHashFragment = window.location.hash;

        repositionForAnchorLink();
    }

    // Private Methods
    var repositionForAnchorLink = function() {
        /* This was added for this issue: https://github.com/chapmanu/cascade-assets/issues/129
         *
         * It is an approach that seems vulnerable to race conditions among loading elements and
         * I am not in love with this solution but I don't know of a better one at moment.
         *
         * When a user visits URL such as:
         * https://www.chapman.edu/admission/undergraduate/contact-us/index.aspx#jane-doe
         * Page needs to be reposition to make sure omninav does not cut off anchor point.
         */
        // Don't bother unless both these elements are present on page.
        if ( ! (omninavPresent && personnelListingWidgetPresent && urlHashFragment) ) {
            return false;
        }

        // Delay to give other page elements a change to load.
        var repositionDelay = 500;

        // Pull anchor identifer from URL hash.
        var anchorIdentifer = urlHashFragment.slice(1);

        // Identify target
        var targetSelector = 'span#' + anchorIdentifer
        var $target = $(targetSelector);

        // If target present, reposition page.
        if ( $target.length ) {
            var newTopPosition = $target.offset().top - omninavHeight;

            // Wait for other dynamic elements of page to load or it won't scroll to correct spot.
            setTimeout(function() {
                var newTopPosition = $target.offset().top - omninavHeight;
                $("body, html").animate({scrollTop: newTopPosition}, 1000);
            }, repositionDelay);
        }
    }

    // Public API
    return {
        init: initOnDocumentReady
    };
})();

$(document).ready(function() {
    personnelWidget.init();
});
