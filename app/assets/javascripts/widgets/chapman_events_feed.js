/**
 * Runs on Document ready
 */
$(document).ready(function() {
  $('[data-chapman-events-feed]').each(function() {
    $(this).chapmanEventsFeed( { 
      url: $(this).data('chapman-events-feed'),
      per: 4
    });
  });
});