module.exports = function(grunt, options){
  var yeoman = options.yeoman;
  return {
		options: {
			dest: yeoman.dist
			// flow: { steps: { 'js': ['concat'], css: ['concat', 'cssmin'] }, post: {}} // Comment/Uncomment to Enable/Disabled Uglify for JS
		},
		html: yeoman.app + '/index.html'
	};
};
