var SidePanelHeroVideo = {};

SidePanelHeroVideo.resize = function(e) {
  var $video      = $('#background-video');
  var $parent     = $video.parent();
  var videoRatio  = 1.7777777778;
  var parentRatio = $parent.width() / $parent.height();

  if (parentRatio >= videoRatio)
    $video.width('100%');
  else
    $video.width($parent.height() * videoRatio);
};

SidePanelHeroVideo.listen = function() {
  var timeoutId;

  $(window).on('resize', function(e) {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(SidePanelHeroVideo.resize, 40);
  });

  $(document).on('ready', SidePanelHeroVideo.resize);
};

SidePanelHeroVideo.listen();