/**
 *  A Jquery Extention that hooks into the events.chapamn.edu feed.
 *
 * Usage: $('#my-cool-feed').chapmanEventsFeed({url: 'https://events.chapman.edu?group_id=56'});
 *
 * This will fill in the #my-cool-feed
 */

(function( $ ){

  /**
   * The constructor that takes in an object of options.
   */
  ChapmanEventsFeed = function(options) {
    if (!options || !options.url) throw "ChapmanEventsFeed needs to have a url passed into the options object."
    this.per          = options.per   || 5;
    this.browse_link  = options.browse_link === undefined ? true : options.browse_link;
    this.feed         = options.feed        === undefined ? true : options.feed;
    this.featured     = options.featured    === undefined ? true : options.featured;
    this.$element     = options.$element;
    this.url          = options.url;
    this.feed_url     = this.feedUrl();
    this.featured_url = this.featuredUrl();
  };


  /**
   * Converts the url into the feed url for ajax
   */
  ChapmanEventsFeed.prototype.feedUrl = function() {
    var parser  = document.createElement('a');
    parser.href = this.url;
    parser.pathname += 'feed';
    return parser.href;
  };

  /**
   * Converts the url into the featured url for ajax
   */
  ChapmanEventsFeed.prototype.featuredUrl = function() {
    var parser  = document.createElement('a');
    parser.href = this.url;
    parser.pathname += 'featured';
    return parser.href;
  }


  /**
   * Makes the ajax request to our endpoint.  This expects an html response.
   */
  ChapmanEventsFeed.prototype.fetchFeed = function(callback) {
    $.ajax({
      method:  'GET',
      data:    { per: this.per },
      url:     this.feed_url,
      success: this.onFeedSuccess.bind(this),
      error:   this.onFeedError.bind(this)
    });
  };

  /**
   * Makes the ajax request for the featured event spot.  Expects an html response
   */
  ChapmanEventsFeed.prototype.fetchFeatured = function() {
    $.ajax({
      method:  'GET',
      url:     this.featured_url,
      success: this.onFeaturedSuccess.bind(this),
      error:   this.onFeaturedError.bind(this)
    });
  };

  /**
   * The callback for when feed ajax was a success
   */
  ChapmanEventsFeed.prototype.onFeedSuccess = function(data) {
    this.$element.append('<div class="feed-column">' +
                              data +
                            '<a class="browse-link" href="'+this.url+'">View all at events.chapman.edu &raquo;</a> \
                          </div>');
  };

  /**
   * The callback for when feed ajax encountered an error;
   */
  ChapmanEventsFeed.prototype.onFeedError = function(message) {
    this.$element.html("<p>There was a problem loading events.</p>")
  };

  ChapmanEventsFeed.prototype.onFeaturedSuccess = function(data) {
    this.$element.append('<div class="featured-column">' + data + '</div>');                          
  };

  ChapmanEventsFeed.prototype.onFeaturedError = function(message) {
    this.$element.html("<p>There was a problem loading events.</p>")
  };




  /**
   * The jQuery extention so that we can use this easily.
   */
  $.fn.chapmanEventsFeed = function(options) {
    options.$element = this;
    this.cef = new ChapmanEventsFeed(options);
    if (this.cef.feed) { 
      this.cef.fetchFeed();
      this.addClass('contains-feed');
    }
    if (this.cef.featured) {
      this.cef.fetchFeatured();
      this.addClass('contains-featured');
    }
    this.addClass('chapman-events-feed');
    return this;
  };

})( jQuery );



/**
 * Runs on Document ready
 */
$(document).ready(function() {
  $('[data-chapman-events-feed]').each(function() {
    $(this).chapmanEventsFeed({url: $(this).data('chapman-events-feed')});
  });
});