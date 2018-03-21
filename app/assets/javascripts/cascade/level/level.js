function wrapIframes() {
  // There's some uncertainty about what elements are being targeted with this modification:
  // just embedded YouTube videos? All embedded videos? Blacklist below is added to avoid breaking
  // any existing behavior while providing some flexibility in more selectively applying wrap to
  // future embeds.
  var skipClass = '.no-video';

  // iframe Blacklist: Skip any iframes with the following selectors.
  var iframeSelectorBlacklist = [
    skipClass,                          // Class user can add in Cascade.
    '#no-video',                        // This is for existing cases (should use class above).
    '#map_frame',
    // Special cases can be added below:
    '#message-your-lawmaker-iframe'     // countable.us widget
  ];
  var notSelector = iframeSelectorBlacklist.join(', ');

  $('.editableContent iframe').not(notSelector).each(function() {
    // Point any YouTube videos to https address.
    this.src.replace('http://www.youtube.com','https://www.youtube.com');

    // Wrap in div.video tag to apply stylesheet rules which adds large bottom-padding. If
    // iframe has parent with skipClass tag then skip. This is for non-video embeds that may
    // dynamically generate iframes (like countable.us). It gives Cascade users themselves a
    // chance to avoid video styling by wrapping embed in <div class="no-video"> tag.
    // See https://github.com/chapmanu/cascade-assets/issues/87 for more details.
    var isWrappedWithNoVideoTag = $(this).parents(skipClass).length > 0;
    if ( ! isWrappedWithNoVideoTag ) {
      $(this).wrap('<div class="video"/>');
    }
  });
}

$(document).ready(function() {
  wrapIframes();

  // Added for links (really calls to action) in right col callouts:
  $(".rightColumn").on("click", ".newbutton a", function () {
    recordOutboundLink($(this)[0], "Outbound-link_" + document.title.replace(" | Chapman University", ''), $(this).attr("href"), $(this).text());
  });
});
