/**
 *  A Jquery Extension that hooks into the events.chapamn.edu feed.
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
    if (!options || !options.feed_path) throw "ChapmanEventsFeed needs to have a url passed into the options object."
    this.per               = options.per   || 2;
    this.browse_link       = options.browse_link === undefined ? true : options.browse_link;
    this.feed              = options.feed        === undefined ? true : options.feed;
    this.featured          = options.featured    === undefined ? true : options.featured;
    this.$feed_element     = options.$feed_element;
    this.$featured_element = options.$featured_element;
    this.feed_path         = options.feed_path;
    this.featured_path     = options.featured_path;
    this.feed_url          = this.feedUrl();
    this.featured_url      = this.featuredUrl();
  };


  /**
   * Converts the url into the feed url for ajax
   */
  ChapmanEventsFeed.prototype.feedUrl = function() {
    var parser  = document.createElement('a');
    parser.href = this.feed_path;
    parser.pathname += 'feed.json';
    return parser.href;
  };

  /**
   * Converts the url into the featured url for ajax
   */
  ChapmanEventsFeed.prototype.featuredUrl = function() {
    var parser  = document.createElement('a');
    parser.href = this.featured_path;
    parser.pathname += '/feed.json';
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
      data:    { alt_url: this.feed_url },
      url:     this.featured_url,
      headers: {'Access-Control-Allow-Origin': '*'},
      success: this.onFeaturedSuccess.bind(this),
      error:   this.onFeaturedError.bind(this)
    });
  };

  /**
   * The callback for when feed ajax was a success
   */
  ChapmanEventsFeed.prototype.onFeedSuccess = function(data) {
    var $event_cards = $(),
        $feed_column = $('<div class="feed-column"></div>'),
        self = this;

    $.each(data.events, function(index, event) {
      var $card = $('<div class="event-card"></div>')
            .append(self.eventCardDate(event.formatted_date))
            .append(self.eventCardText(event));
      $event_cards = $event_cards.add($card);
    });

    $feed_column.append($event_cards);
    this.$feed_element.addClass('contains-feed');
    this.$feed_element.append($feed_column);
  };

  /**
   * The callback for when feed ajax encountered an error;
   */
  ChapmanEventsFeed.prototype.onFeedError = function(message) {
    this.$feed_element.html("<p>There was a problem loading events.</p>");
  };

  ChapmanEventsFeed.prototype.onFeaturedSuccess = function(data) {
    $featured_event = $('<div class="featured-event event-card"></div>')
        .append(this.eventCardDate(data.formatted_date))
        .append(this.eventCardImg(data))
        .append(this.eventCardText(data));
    this.$featured_element.addClass('contains-featured');
    this.$featured_element.append($featured_event);
  };

  ChapmanEventsFeed.prototype.onFeaturedError = function(message) {
    console.log("There's no featured event for the current events feed.");
  };

  ChapmanEventsFeed.prototype.eventCardDate = function(date) {
    var date_arr = date.split(",");
    var date_html = [
      '<div class="event-date"><div class="date-wrapper">',
        '<div class="left date-column"><p>'+ date_arr[0] +'</p></div>',
        '<div class="right date-column"><p>'+ date_arr[1] +'</p><p>'+ date_arr[2] +'</p></div>',
      '</div></div>'
    ];

    return date_html.join('\n');
  };

  ChapmanEventsFeed.prototype.eventCardText = function(event) {
    var text_content_html = [
      '<div class="text-content">',
        '<h3><a href="'+ event.url +'">'+ event.title +'</a></h3>',
        '<p>' + event.formatted_time + '</p>',
        '<p class="location">' + event.location + '</p>',
      '</div>'
    ];

    return text_content_html.join('\n');
  };

  ChapmanEventsFeed.prototype.eventCardImg = function(event) {
    var image_div = $('<div class="featured-image"></div>')
          .css('background-image', 'url(' + event.cover_photo + ')');
    return image_div;
  };

  /**
   * The jQuery extention so that we can use this easily.
   */
  $.fn.chapmanEventsFeed = function(options) {
    options.$feed_element = this;
    options.$featured_element = $('[data-chapman-featured-event]');
    this.cef = new ChapmanEventsFeed(options);
    if (this.cef.feed)     { this.cef.fetchFeed(); }
    if (this.cef.featured) { this.cef.fetchFeatured(); }

    this.addClass('chapman-events-feed');
    return this;
  };

})( jQuery );