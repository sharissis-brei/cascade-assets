var Messaging2Column = {};

Messaging2Column.resize_timer =  null;

Messaging2Column.centerMessagingMedia = function() {
  clearTimeout(Messaging2Column.resize_timer);
  Messaging2Column.resize_timer = setTimeout(function(){
    $('.messaging-widget.messaging-widget__2-column').each(function() {
      var $text  = $(this).find('.text-column');
      var $media = $(this).find('.media-column');
      if (Media.smallScreen()) {
        $media.css('height', 'auto');
      } else {
        $media.css('height', $text.height());
      }
    });
  }, 10);
};


// Initialize
$(document).ready(function() {Messaging2Column.centerMessagingMedia(); console.log("Fired centering function on ready"); });
$(window).on('resize', Messaging2Column.centerMessagingMedia);