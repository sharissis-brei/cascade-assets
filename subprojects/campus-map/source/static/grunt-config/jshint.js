module.exports = function(grunt, options){
  var yeoman = options.yeoman;
  return {
    options: {
      jshintrc: '.jshintrc'
    },
    all: ['Gruntfile.js',
      yeoman.app + '/js/{,*/}*.js',
      '!' + yeoman.app + '/js/plugins.js',
      '!' + yeoman.app + '/js/plugins/*',
      '!' + yeoman.app + '/js/vendor/*',
      '!' + yeoman.app + '/js/map/mapOverlays.js',
      '!' + yeoman.app + '/js/mapOverlays.js',
      '!' + yeoman.app + '/js/lib/modernizr.js',
      '!' + yeoman.app + '/js/map/categoryMenu.js',
      '!' + yeoman.app + '/js/map/mainNavigation.js',
      '!' + yeoman.app + '/js/map/managePanels.js',
      '!' + yeoman.app + '/js/map/map.js',
      '!' + yeoman.app + '/js/map/mapBar.js',
      '!' + yeoman.app + '/js/map/missionControl.js',
      '!' + yeoman.app + '/js/map/omniNav.js',
      '!' + yeoman.app + '/js/map/overlays.js',
      '!' + yeoman.app + '/js/map/tourPanel.js',
      'test/spec/{,*/}*.js'
    ]
  }
};