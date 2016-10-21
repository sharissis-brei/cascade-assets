$(document).ready(function() {
	$('.chapman-stories-feed-widget').each(function() {
		$(this).chapmanStoriesFeed({
			base_url: "http://social.localchapman.edu:3000",
			feed_url: $('[data-chapman-stories-feed]').data('chapman-stories-feed'),
			top_story_url: $('[data-chapman-top-story]').data('chapman-top-story')
		});
	});
});