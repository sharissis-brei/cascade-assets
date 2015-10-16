var Messaging2Column = {};

Messaging2Column.resize_timer =  null;

Messaging2Column.centerMessagingMedia = function() {
  clearTimeout(Messaging2Column.resize_timer);
  Messaging2Column.resize_timer = setTimeout(function(){
    var $text  = $('.messaging-2-column .text-column');
    var $media = $('.messaging-2-column .media-column');
    if (Media.smallScreen()) {
      $media.css('height', 'auto');
    } else {
      $media.css('height', $text.height());
    }
  }, 10);
};


// Initialize
$(document).on('ready', function() {Messaging2Column.centerMessagingMedia(); });
$(window).on('resize', Messaging2Column.centerMessagingMedia);