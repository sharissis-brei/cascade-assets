/**
 * A Jquery Extension that hooks into the events.chapman.edu/:id feed.
 *
 * Usage: $('#my-cool-feed').chapmanFeaturedEvent({url: `https://events.chapman.edu/:id`});
 *
 * This whill fill in the #my-cool-feed
 */

(function ( $ ){

  ChapmanFeaturedEvent = function(options) {
    this.url      = options.url;
    this.feed_url = this.feedUrl();
    this.$element = options.$element;
  };

  ChapmanFeaturedEvent.prototype.feedUrl = function() {
    var parser = document.createElement('a');
    parser.href = this.url;
    parser.pathname += '/feed';
    return parser.href;
  };

  ChapmanFeaturedEvent.prototype.fetchFeed = function(callback) {
    $.ajax({
      method:  'GET',
      url:     this.feed_url,
      headers: {'Access-Control-Allow-Origin': '*'},
      success: this.onFeedSuccess.bind(this),
      error:   this.onFeedError.bind(this)
    });
  };

  ChapmanFeaturedEvent.prototype.onFeedSuccess = function(data) {
    console.log(data);
    console.log(this.$element)
    this.$element.addClass('contains-featured');
    this.$element.append('<div class="featured-column">' + data + '</div>');
  };

  ChapmanFeaturedEvent.prototype.onFeedError = function(message) {
    this.$element.html("<p>There was a problem loading events.</p>");
  }


  $.fn.chapmanFeaturedEvent = function(options) {
    options.$element = this;
    this.cfe = new ChapmanFeaturedEvent(options);
    this.cfe.fetchFeed();
    this.addClass('chapman-featured-event');
    return this;
  };

})( jQuery );