/**
 * Runs on Document ready
 */
$(document).ready(function() {
  $('[data-chapman-events-feed]').each(function() {
    $(this).chapmanEventsFeed({ 
      feed_path: $(this).data('chapman-events-feed'),
      featured_path: $('[data-chapman-featured-event]').data('chapman-featured-event'),
      per: 2
    });
  });
});