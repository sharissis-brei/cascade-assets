module ContentTypes
  class ModularController < ApplicationController
    layout false
    after_action :render_region_tags, :render_system_page_meta_tags

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
        'OMNI-NAV' => render_static_partial('widgets/shared/omninav'),
        'NAVIGATION' => render_static_partial('widgets/shared/navigation'),
        'MASTHEAD' => cascade_format('_cascade/formats/modular/one_column_masthead',
                                     @data_definition),
        'PRIMARY CONTENT' => '<h2>Welcome to the Spike!</h2>',
        'GLOBAL FOOTER' => render_static_partial('widgets/shared/footer')
      }

      render @configuration_set.template
    end

    # GET /modular/one_column
    # Maps to Content Types/Modular/1 Column in Cascade.
    def one_column
      render plain: 'TODO'
    end

    private

    def cascade_format(format_path, data)
      velocity_render(format_path, data)
    end

    def velocity_render(format_path, data)
      # TODO: figure out how to stub this. Do we try to make an external call to a Velocity
      # renderer that parses the format path? Or maybe just make the format path file a Rails
      # module with a structure that parallels the format file in Cascade.
      format('TODO: render %s somehow', format_path)
    end

    def render_static_partial(view_path)
      # This can be used as a workaround until cascade formatting issue is resolved.
      render_to_string(partial: view_path)
    end

    def render_region_tags
      @configuration_set.regions.each do |name, html|
        region_tag = format('<system-region name="%s"/>', name)
        response.body = response.body.gsub(region_tag, html)
      end
    end

    def render_system_page_meta_tags
      @metadata_set.class.column_names.each do |name|
        meta_tag = format('<system-page-meta-%s/>', name)
        html = format('<meta name="%s" content="%s"/>', name, @metadata_set.send(name))
        response.body = response.body.gsub(meta_tag, html)
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
end
