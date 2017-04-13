module.exports = function(grunt, options){
  var yeoman = options.yeoman;
  return {
	  options: {
	    dirs: [yeoman.dist]
	  },
	  html: [yeoman.dist + '/{,*/}*.html'],
	  css: [yeoman.dist + '/css/{,*/}*.css']
	}
};