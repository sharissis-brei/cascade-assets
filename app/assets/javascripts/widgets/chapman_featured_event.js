/**
 * Runs on Document ready
 */
$(document).ready(function() {
  $('[data-chapman-featured-event]').each(function() {
    $(this).chapmanFeaturedEvent( { 
      url: $(this).data('chapman-featured-event')
    });
  });
});