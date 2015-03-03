require 'jekyll-assets'
require 'jekyll-assets/rails-assets'

# Add the svgs to the sprockets path
RailsAssetsChapmanWebComponents.gem_path
Sprockets.append_path(RailsAssetsChapmanWebComponents.gem_path.join('app', 'assets', 'fonts', 'chapman-web-components', 'dist'))