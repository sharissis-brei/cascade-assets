#
# ContentTypes::ModularController
#
# This controller models development in Cascade by recreating and mocking the different
# components that go into design a Content Type, or page template, in Cascade.
#
# These properties define a ContentType in Cascade (Administration > Content Types > Modular):
# - Name
# - Configuration Set (including page template)
# - Metadata Set
# - Data Definition (schema for user inputs)
# - Outputs Publishing (xml or html)
#
module ContentTypes
  class ModularController < ApplicationController
    layout false
    before_action :build_assets_on_fly
    after_action :render_region_tags, :render_system_page_meta_tags

    # GET /modular/spike
    def spike
      # TODO: Move this to one_column method and remove this method.
      @configuration_set = ConfigurationSet.one_column
      @metadata_set = MetadataSet.page(title: 'Modular ContentType Spike')

      # TODO: Add a tableless DataDefinition model.
      @data_definition = nil

      # Define configuration set regions.
      @configuration_set.regions = {
        # TODO: clean these up!
        'JQUERY' => '<script src="//ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>',

        # We can just set the paths statically because we turned off assets digest and debug in
        # config/environments/development.rb and are building assets on fly in before_action.
        'CASCADE ASSETS' => format("%s\n%s",
                                   '<script src="/_assets/master.js"></script>',
                                   '<link rel="stylesheet" media="all" href="/_assets/master.css" />'),

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

    # GET /modular/ad_landing
    # Maps to Content Types/Modular/Ad Landing in Cascade.
    def ad_landing
      @configuration_set = ConfigurationSet.ad_landing
      @metadata_set = MetadataSet.page(title: 'Ad Landing Page',
                                       template: '_cascade/templates/modular/ad_landing.html')

      render @configuration_set.template
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
      end if @configuration_set
    end

    def render_system_page_meta_tags
      @metadata_set.class.column_names.each do |name|
        meta_tag = format('<system-page-meta-%s/>', name)
        html = format('<meta name="%s" content="%s"/>', name, @metadata_set.send(name))
        response.body = response.body.gsub(meta_tag, html)
      end if @metadata_set
    end

    def build_assets_on_fly
      # It's not pretty but it works. I think.
      # See http://stackoverflow.com/a/9943895/6763239
      require 'rake'
      Rake::Task.clear # necessary to avoid tasks being loaded several times in dev mode
      CascadeAssetsRails::Application.load_tasks # providing your application name is 'sample'

      # This is what the Build :do_precompile task does.
      Rake::Task['assets:clobber'].invoke
      Rake::Task['assets:precompile'].invoke
    end
  end
end
