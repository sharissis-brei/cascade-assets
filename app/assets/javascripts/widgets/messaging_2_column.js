var Messaging2Column = {};

Messaging2Column.resize_timer =  null;

Messaging2Column.centerMessagingMedia = function() {
  clearTimeout(Messaging2Column.resize_timer);
  Messaging2Column.resize_timer = setTimeout(function(){
    $('.messaging-widget.messaging-widget__2-column').each(function() {
      var $text  = $(this).find('.text-column');
      var $media = $(this).find('.media-column');
      $media.css('height', 'auto');
      var text_height  = $text.height();
      var media_height = $media.height();

      if (Media.smallScreen() || text_height === media_height)
        return;
      if (media_height < text_height)
        $media.css('height', $text.height());
    });
  }, 0);
};


// Initialize
$(document).ready(function() {Messaging2Column.centerMessagingMedia(); });
$(window).on('resize', Messaging2Column.centerMessagingMedia);