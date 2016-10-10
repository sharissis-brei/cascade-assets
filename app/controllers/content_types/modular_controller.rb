class ContentTypes::ModularController < ApplicationController
  layout nil
  after_filter :render_regions

  # GET /modular/spike
  def spike
    # These properties define a ContentType in Cascade (Administration > Content Types > Modular):
    # - Name
    # - Configuration Set
    # - Metadata Set
    # - Data Definition
    # - Outputs Publishing
    @configuration_set = ConfigurationSet.one_column
    @metadata_set = MetadataSet.page(title: 'Modular ContentType Spike')

    # TODO: Add a tableless DataDefinition model.
    @data_definition = nil

    # Define configuration set regions.
    @configuration_set.regions = {
      'PRIMARY CONTENT' => '<h2>Welcome to the Spike!</h2>'
    }

    render @configuration_set.template
  end

  # GET /modular/one_column
  # Maps to Content Types/Modular/1 Column in Cascade.
  def one_column
    render plain: 'TODO'
  end

  private

  def render_regions
    @configuration_set.regions.each do |name, html|
      region_tag = format('<system-region name="%s"/>', name)
      response.body = response.body.gsub(region_tag, html)
    end
  end

  def render_system_page_meta_tags
    # TODO
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
