require 'jekyll-assets'
require 'jekyll-assets/rails-assets'
require 'jekyll-assets/bourbon'
require 'jekyll-assets/neat'
require 'sprockets/sass'

# Add the svgs to the sprockets path
Sprockets.append_path(RailsAssetsChapmanWebComponents.gem_path.join('app', 'assets', 'fonts', 'chapman-web-components', 'dist'))

# Give me some line numbers please!
Sprockets::Sass.options[:style] = :expanded
Sprockets::Sass.options[:line_comments] = true
Sprockets::Sass.options[:line_numbers] = true