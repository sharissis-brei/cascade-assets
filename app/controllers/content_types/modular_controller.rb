class ContentTypes::ModularController < ApplicationController
  layout 'modular'
  after_filter :render_regions

  # GET /modular/spike
  def spike
    # Spike demonstrating new pattern in simplified form.
    @regions = {
      'PRIMARY CONTENT' => '<h2>Welcome to the Spike!</h2>'
    }
  end

  # GET /modular/one_column
  # Maps to Content Types/Modular/1 Column in Cascade.
  def one_column
    render plain: 'TODO'
  end

  private

  def render_regions
    @regions.each do |name, html|
      region_tag = format('<system-region name="%s"/>', name)
      response.body = response.body.gsub(region_tag, html)
    end
  end

  def cascade_assets
    # Based on:
    # - http://microblog.anthonyestebe.com/2014-04-28/compile-your-scss-according-to-your-model-on-rails/
    # - https://github.com/BLauris/custom-css-for-user/blob/master/lib/generate_custom_style.rb
    # Compile assets here so that we can replace <system-region name="CASCADE ASSETS"/> tag
    # with them. This currently chokes on import lines in SASS files:
    # Sass::SyntaxError: File to import not found or unreadable: settings/
    opts = {
      syntax: :scss,
      load_paths: CascadeAssetsRails::Application.assets.paths,
      style: :nested
    }
    css = File.read(File.join(Rails.root, 'app', 'assets', 'stylesheets', 'master.scss'))

    html = <<-HTML
<style>
  %s
</style>
HTML
    format(html, Sass::Engine.new(css, opts).render)
  end
end
