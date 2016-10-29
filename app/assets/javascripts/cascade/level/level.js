function wrapIframes() {
  // There's some uncertainty about what elements are being targeted with this modification:
  // just embedded YouTube videos? All embedded videos? Blacklist below is added to avoid breaking
  // any existing behavior while providing some flexibility in more selectively applying wrap to
  // future embeds.

  // iframe Blacklist: Skip any iframes with the following selectors.
  var iframeSelectorBlacklist = [
    '#no-video',                        // ID user can add in Cascade
    '#message-your-lawmaker-iframe'     // countable.us widget
  ];
  var notSelector = iframeSelectorBlacklist.join(', ');

  $('.editableContent iframe').not(notSelector).each(function() {
    // Point any YouTube videos to https address.
    this.src.replace('http://www.youtube.com','https://www.youtube.com');

    // Wrap in div.video tag
    $(this).wrap('<div class="video"/>');
  });
}

$(document).ready(function() {
  wrapIframes();

  // Added for links (really calls to action) in right col callouts:
  $(".rightColumn").on("click", ".newbutton a", function () {
    recordOutboundLink($(this)[0], "Outbound-link_" + document.title.replace(" | Chapman University", ''), $(this).attr("href"), $(this).text());
  });
});
