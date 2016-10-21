(function( $ ) {

	ChapmanStoriesFeed = function(options) {
		this.base_url						 = options.base_url;
		this.feed_url 			     = this.buildFeedUrl(options.feed_url);
		this.top_story_url	     = this.buildTopStoryUrl(options.top_story_url);
		this.$feed_element 		   = options.$feed_element;
		this.$top_story_element  = options.$top_story_element;
		this.per			           = options.per || 4;
	}

	ChapmanStoriesFeed.prototype.buildFeedUrl = function(feed_url) {
		var parser = document.createElement('a');
		var blog_url_param = "url=" + encodeURIComponent(feed_url);

		parser.href = this.base_url;
		parser.pathname += 'feed';
		parser.search += ('service=wordpress&' + blog_url_param);

		return parser.href;
	}

	ChapmanStoriesFeed.prototype.buildTopStoryUrl = function(top_story_url) {
		var parser = document.createElement('a');
		parser.href = this.base_url;
		parser.pathname += 'top_story';

		if(top_story_url) {
			var blog_url_param = "url=" + encodeURIComponent(top_story_url);
			var separator = (parser.href.indexOf("?")===-1)?"?":"&";
			parser.href = parser.href + separator + blog_url_param;
		}

		return parser.href;
	}

	ChapmanStoriesFeed.prototype.getFeed = function() {
		$.ajax({
			method: 'GET',
			data: {per: this.per},
			url : this.feed_url ,
			success: this.displayFeed.bind(this),
			error: this.onFeedError.bind(this)
		});
	};

	ChapmanStoriesFeed.prototype.getTopStory = function() {
		$.ajax({
			method: 'GET',
			url: this.top_story_url,
			success: this.displayTopStory.bind(this),
			error: this.onFeedError.bind(this)
		});
	};
	
	ChapmanStoriesFeed.prototype.displayFeed = function(data) {
		if(data.length) {
			this.$feed_element.append(data);
		}
	};

	ChapmanStoriesFeed.prototype.displayTopStory = function(data) {
		if(data.length) {
			this.$top_story_element.append(data);
		}
	};

	ChapmanStoriesFeed.prototype.onFeedError = function(msg) {
		this.$feed_element.html("<p>There was a problem loading stories.</p>");
	}
	
	$.fn.chapmanStoriesFeed = function(options) {
	    options.$feed_element = $('[data-chapman-stories-feed]');
	    options.$top_story_element = $('[data-chapman-top-story]');
	    this.csf = new ChapmanStoriesFeed(options);
	    this.csf.getTopStory();
	    this.csf.getFeed();
	    return this;
  	};

})(jQuery);