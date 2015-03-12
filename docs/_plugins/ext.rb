require 'jekyll-assets'
require 'jekyll-assets/rails-assets'
require "sprockets/sass"

# Add the svgs to the sprockets path
RailsAssetsChapmanWebComponents.gem_path
Sprockets.append_path(RailsAssetsChapmanWebComponents.gem_path.join('app', 'assets', 'fonts', 'chapman-web-components', 'dist'))

# Give me some line numbers please!
# Compass equivalent: `output_style`
Sprockets::Sass.options[:style] = :expanded

# Compass equivalent: `line_comments`

Sprockets::Sass.options[:line_comments] = true
Sprockets::Sass.options[:line_numbers] = true