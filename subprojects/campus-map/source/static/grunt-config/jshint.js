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
      'test/spec/{,*/}*.js'
    ]
  }
};