/**
 * Functions to help determine what size screen we are on.  Make sure these
 * pixel width stay in sync with what we have in our scss variables.
 */

var Media = {
  medium_screen: 600,
  large_screen: 1120
};

Media.smallScreen = function() {
  var screen_size = $(window).width();
  return (screen_size < Media.medium_screen);
};

Media.mediumScreen = function() {
  var screen_size = $(window).width();
  return (screen_size >= Media.medium_screen && screen_size < Media.large_screen);
};

Media.largeScreen = function() {
  var screen_size = $(window).width();
  return (screen_size >= Media.largeScreen);
};
