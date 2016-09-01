/*
 * Fetch images from Chapman Flickr and Picasa feeds for widgets.
 */
var ChapmanImageFeeds = (function() {
    // Constants
    var CHAPMAN_BASE_FEED = 'https://www.chapman.edu/getFeed.ashx?name=';
    var YAHOO_API_ENDPOINT = 'https://query.yahooapis.com/v1/public/yql';

    // Global Attrs
    var $flickr = null;     // Need to select after document ready.
    var $picasa = null;     // Need to select after document ready.

    // Public Methods
    var initOnDocumentReady = function() {
        // Call this in onReady block.
        $flickr = $('.flickr-gallery');
        $picasa = $('.picasa-gallery');
    }

    var loadFlickrImages = function() {
        var chapmanFeed = CHAPMAN_BASE_FEED + $flickr.data('feed');
        queryYahooApis(chapmanFeed, flickrCallback);
    };

    var loadPicasaImages = function() {
        var chapmanFeed = CHAPMAN_BASE_FEED + $picasa.data('feed');
        queryYahooApis(chapmanFeed, picasaCallback);
    };

    // Private Methods
    var queryYahooApis = function(chapmanFeed, onSuccessCallback) {
        // Let's use JSONP: https://learn.jquery.com/ajax/working-with-jsonp/
        params = {
            q: "select * from xml where url='" + chapmanFeed +"'",
            format: "json",
            diagnostics: true
        };

        $.ajax({
            url: YAHOO_API_ENDPOINT,
            jsonp: "callback",
            dataType: "jsonp",
            data: params,
            success: onSuccessCallback
        });
    }

    var flickrCallback = function(data) {
        var $flul = $flickr.find('ul');
        var images = populateWidgetWithImages($flul, data);

        // Update See Full Gallery link.
        if ( images ) {
            var apiLink = data.query.results.feed.link[0].href;
            var userId = apiLink.split('userid=')[1].split('&')[0];
            $flickr.find(".more-link").attr("href", 'https://www.flickr.com/groups/' + userId);
        }
    };

    var picasaCallback = function(data) {
        var $pcul = $picasa.find('ul');
        var images = populateWidgetWithImages($pcul, data);

        // Update See Full Gallery link.
        if ( images ) {
            $picasa.find(".more-link").attr("href", data.query.results.feed.id);
        }
    };

    var populateWidgetWithImages = function($parent, feedData) {
        var populatedImages = [];
        var results = feedData.query.results;

        if ( ! results ) {
            console.warn('Failed to get image feed results:', feedData);
            return populatedImages;
        }

        var feed = results.feed; 
        var isPicasaFeed = feed.id.indexOf('picasa') !== -1;

        for (var i = 0; i < 4; i += 1) {
            var data = feed.entry[i];
            var href = data.link[0].href;
            var title = data.title;
            var src = data.link[data.link.length - 1].href;

            // If we ever support a third feed, we can come up with something less crude then.
            if ( isPicasaFeed ) {
                href = data.link[1].href;
                title = data.title.content;
                src = data.content.src;
            }

            var $item = $("<li>").append(
                $("<a>").attr({
                    "href": href,
                    "title": title,
                    "target": "_blank"
                }).append(
                    $("<img>").attr({ 'src': src })
                )
            ).appendTo($parent);

            if ($item.find('img').width() >= 77) {
                $item.find('img').css({
                    'width': '100%'
                })
            } else {
                $item.find('img').css({
                    'height': '100%'
                })
            }
        }
    }
 
    // Public API
    return {
        init: initOnDocumentReady,
        flickr: loadFlickrImages,
        picasa: loadPicasaImages
    };
})();


// On document ready.
$(function () {
    ChapmanImageFeeds.init();
    ChapmanImageFeeds.flickr();
    ChapmanImageFeeds.picasa();
});
