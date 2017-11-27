/*
 * Chapman Social Feed jQuery Plugin
 *
 * Based on this pattern:
 * https://github.com/jquery-boilerplate/jquery-boilerplate/blob/master/src/jquery.boilerplate.js
 *
 */
// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;(function($, window, document, undefined) {

  "use strict";

  var pluginName = 'chapmanStoriesFeed';

  // undefined is used here as the undefined global variable in ECMAScript 3 is
  // mutable (ie. it can be changed by someone else). undefined isn't really being
  // passed in so we can ensure the value of it is truly undefined. In ES5, undefined
  // can no longer be modified.

  // window and document are passed through as local variables rather than global
  // as this (slightly) quickens the resolution process and can be more efficiently
  // minified (especially when both are regularly referenced in your plugin).

  // Create the defaults once
  var defaults = {
    feedEndPoint: 'https://social.chapman.edu/',
    baseBlogUrl: 'https://blogs.chapman.edu/',
    feedService: 'wordpress',
    storiesPerPage: 4,

    // The values are expected to be data attributes on the element. The user supplies them
    // via the Cascade interface.
    dataTitle: 'Chapman Stories Feed',
    dataBgColor: null,
    dataButtonLabel: 'View more stories',
    dataButtonUrl: 'https://blogs.chapman.edu/',
    dataTopStoryUrl: 'https://blogs.chapman.edu/'
  };

  // The actual plugin constructor
  function Plugin(element, options) {
    this.element = element;
    this.$element = $(element);

    // jQuery has an extend method which merges the contents of two or
    // more objects, storing the result in the first object. The first object
    // is generally empty as we don't want to alter the default options for
    // future instances of the plugin
    this.settings = $.extend({}, defaults, options);
    this._defaults = defaults;
    this._name = pluginName;
    this.init();
  }

  // Avoid Plugin.prototype conflicts
  $.extend(Plugin.prototype, {

    init: function() {
      // Data attribute values
      this.feedParams       = {service: this.settings.feedService, per: this.settings.storiesPerPage};
      this.feedUrl          = this.settings.feedEndPoint;
      this.topStoryUrl      = this.$element.data('chapmanStoriesTopStoryUrl');
      this.title            = this.$element.data('chapmanStoriesTitle') || this.settings.dataTitle;
      this.backgroundColor  = this.$element.data('chapmanStoriesBgColor') || this.settings.dataBgColor;
      this.buttonLabel      = this.$element.data('chapmanStoriesButtonLabel') || this.settings.dataButtonLabel;
      this.buttonUrl        = this.$element.data('chapmanStoriesButtonUrl') || this.settings.dataButtonUrl;

      this.parseDataUrl();
      this.buildOutWidget();
    },

    // The url in data attr can either be social.chapman or blogs.chapman
    // The feed enpoint will always be a social.chapman url but now the blogs source can either be specified
    // by params in a social.chapman url or a specific blog
    parseDataUrl: function() {
      var self = this;
      var dataUrl = this.$element.data('chapmanStoriesFeedUrl');

      if(!dataUrl){ return; }

      // if the data attr is a blogs url, it will be set to the source url in the feed params
      if(dataUrl.includes(this.settings.baseBlogUrl)){
        // inside db stores blog urls without trailing slash
        this.feedParams['source'] = dataUrl.replace(/\/?$/, '');
      } else {
        // get any params that are set in data attr url and add/replace them in the feed params hash
        // This avoids having duplicate params in the feedEndPoint URL
        var dataParams = this.parseUrlParams(dataUrl);
        $.each(dataParams, function(param, value){
          self.feedParams[param] = value;
        });
      }
    },

    parseUrlParams: function(url) {
      var domUrlBuilder = document.createElement('a');
      domUrlBuilder.href = url;
      var params = domUrlBuilder.search.substring(1);
      return params ? $.deparam(params) : {};
    },

    buildOutWidget: function() {
      var $outerContainer = this.buildOuterContainer();
      var $topStory = this.buildTopStoryElement();
      var $storiesFeed = this.buildStoriesFeedElement();

      if ( this.backgroundColor ) {
        this.$element.css('backgroundColor', this.backgroundColor);
      }

      this.$element.html($outerContainer);
      $outerContainer.append($topStory);
      $outerContainer.append($storiesFeed);
    },

    buildOuterContainer: function() {
      var $outerContainer = $('<div />').addClass('outer-container');
      var $title = $('<h2 />').addClass('social-feed-title').text(this.title);

      $outerContainer.append($title);
      return $outerContainer;
    },

    buildTopStoryElement: function() {
      var classes = 'feed-column top-story';
      var loadingHtml = '<p>Loading top story...</p>'
      var $topStoryElement = $('<div />').addClass(classes).html(loadingHtml);

      // if top story post is not specified, it will default to the top story based on the feed params
      var topStoryParams = $.extend(true, {}, this.feedParams);
      if(this.topStoryUrl){ topStoryParams['url'] = this.topStoryUrl; }

      // This will return HTML for top story.
      $.ajax({
        method: 'GET',
        url: this.buildSocialApiEndpoint('top_story', topStoryParams),
        success: function(html) {
          // Note: if html comes wrapped in a hidden tag. It will not be displayed.
          // See https://github.com/chapmanu/inside/issues/774 (data comes from Inside/Social).
          if ( html.length ) {
            $topStoryElement.html(html);
          }
        },
        error: function(data) {
          console.error('Unable to load top story:', data);
          $topStoryElement.html("<p>There was a problem loading the top story.</p>");
        }
      });

      return $topStoryElement;
    },

    buildStoriesFeedElement: function() {
      var classes = 'feed-column stories-feed';
      var loadingHtml = '<p>Loading stories...</p>';
      var $storiesElement = $('<div />').addClass(classes).html(loadingHtml);
      var $feedButton = this.buildFeedButton();
      // This will return HTML for top story.
      $.ajax({
        method: 'GET',
        url: this.buildSocialApiEndpoint('feed', this.feedParams),
        data: this.feedParams,
        success: function(data) {
          if ( data.length ) {
            $storiesElement.html(data);
            $storiesElement.append($feedButton);
          }
        },
        error: function(data) {
          console.error('Unable to load stories:', data);
          $storiesElement.html("<p>There was a problem loading stories.</p>");
        }
      });

      return $storiesElement;
    },

    buildFeedButton: function() {
      var $container = $('<div />').addClass('actions');
      var $button = $('<a />').addClass('theme-button');
      $button.attr('href', this.buttonUrl);
      $button.text(this.buttonLabel);
      return $button;
    },

    buildSocialApiEndpoint: function(path, params){
      // Build URL dynamically using DOM.
      var domUrlBuilder = document.createElement('a');
      domUrlBuilder.href = this.feedUrl;
      domUrlBuilder.pathname = path;
      domUrlBuilder.search = $.param(params);
      return domUrlBuilder.href;
    }
  });

  // A really lightweight plugin wrapper around the constructor,
  // preventing against multiple instantiations.
  $.fn[pluginName] = function(options) {
    return this.each(function() {
      if ( !$.data(this, "plugin_" + pluginName) ) {
        $.data(this, "plugin_" + pluginName, new Plugin(this, options));
      }
    });
  };
})(jQuery, window, document);
