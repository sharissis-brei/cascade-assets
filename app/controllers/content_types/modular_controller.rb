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

    # GET /modular/ad_landing
    # Maps to Content Types/Modular/Ad Landing in Cascade.
    # rubocop:disable Metrics/MethodLength
    def ad_landing
      @configuration_set = ConfigurationSet.ad_landing(
        template: '_cascade/templates/modular/ad_landing.html'
      )
      @metadata_set = MetadataSet.page(title: 'Ad Landing Page')
      @data_definition = DataDefinitions::AdLanding.default

      # Define configuration set regions.
      @configuration_set.regions = {
        'ADDITIONAL BODY AT-END' => '',
        'ADDITIONAL HEAD' => '',
        'CASCADE ASSETS' => cascade_block('_cascade/blocks/html/cascade_assets'),
        'FB_JS_SDK' => cascade_block('_cascade/blocks/html/facebook_javascript_sdk'),
        'GOOGLE_ANALYTICS' => '',
        'JQUERY' => cascade_block('_cascade/blocks/html/jquery'),
        'JUMP LINK' => cascade_block('_cascade/blocks/html/jump_link'),
        'MASTHEAD' => cascade_format('_cascade/formats/modular/ad_landing/widgets/masthead_hero'),
        'META VIEWPORT' => cascade_block('_cascade/blocks/html/global_meta_viewport'),
        'NAVIGATION' => '',
        'OG_TAGS' => '',
        'PAGE WRAPPER CLOSE' => '',
        'PAGE WRAPPER OPEN' => '',

        # TODO: convert these to cascade_format action. There are action items.
        'PRIMARY CONTENT' => render_static_ad_landing_primary_content,
        'FOOTER' => render_static_partial('widgets/ad_landing_page/sponsor_bar')
      }

      render @configuration_set.template
    end
    # rubocop:enable Metrics/MethodLength

    # GET /modular/one_column
    # Maps to Content Types/Modular/1 Column in Cascade.
    # rubocop:disable Metrics/MethodLength
    def one_column
      @configuration_set = ConfigurationSet.one_column
      @metadata_set = MetadataSet.page(title: 'Modular One Column')
      @data_definition = DataDefinitions::OneColumn.default

      # Define configuration set regions. This mimics the regions section of Configuation Set
      # properties view in Cascade.
      @configuration_set.regions = {
        'ADDITIONAL BODY AT-END' => '',
        'ADDITIONAL HEAD' => '',
        'CASCADE ASSETS' => cascade_block('_cascade/blocks/html/cascade_assets'),
        'FB_JS_SDK' => cascade_block('_cascade/blocks/html/facebook_javascript_sdk'),
        'GOOGLE_ANALYTICS' => '',
        'JQUERY' => cascade_block('_cascade/blocks/html/jquery'),
        'JUMP LINK' => cascade_block('_cascade/blocks/html/jump_link'),
        'MASTHEAD' => cascade_format('_cascade/formats/modular/one_column_masthead'),
        'META VIEWPORT' => cascade_block('_cascade/blocks/html/global_meta_viewport'),
        'NAVIGATION' => '',
        'OG_TAGS' => '',
        'PAGE WRAPPER CLOSE' => '',
        'PAGE WRAPPER OPEN' => '',

        # TODO: convert these to cascade_format action.
        'PRIMARY CONTENT' => '<h2>PRIMARY CONTENT GOES HERE!</h2>',
        'GLOBAL FOOTER' => render_static_partial('widgets/shared/footer')
      }

      render @configuration_set.template
    end
    # rubocop:enable Metrics/MethodLength

    private

    # rubocop:disable Metrics/MethodLength
    # TODO: Replace with more Cascadesque rendering.
    def render_static_ad_landing_primary_content
      # This reproduces content from static sample version.
      primary_content = <<-HTML
<div id="column-container" class="ad-landing-column-container">
  <div id="left-column" class="ad-landing-left-column">
    <h2 class="ad-landing-title">%s</h2>
    %s
    %s
  </div>
  <div id="right-column" class="ad-landing-right-column">
    %s
    %s
    %s
  </div>
</div>
HTML

      format(primary_content,
             'Master of Business Administration',
             render_static_partial('widgets/ad_landing_page/messaging_with_video'),
             render_static_partial('widgets/ad_landing_page/messaging_with_image'),
             render_static_partial('widgets/ad_landing_page/feature_points'),
             render_static_partial('widgets/ad_landing_page/excerpt'),
             render_static_partial('widgets/ad_landing_page/messaging_only'))
    end
    # rubocop:enable Metrics/MethodLength

    # TODO: Most of these methods should be moved into a concern.
    def cascade_block(block_path)
      render_to_string(partial: block_path)
    end

    def cascade_format(format_path)
      # Make data definition a local within partial as variable current_page
      render_to_string(partial: format_path, locals: {current_page: @data_definition})
    end

    def render_velocity(format_path, data)
      # TODO: figure out how to stub this. Do we try to make an external call to a Velocity
      # renderer that parses the format path? Or maybe just make the format path file a Rails
      # module with a structure that parallels the format file in Cascade.
      format('TODO: render %s somehow with data %s', format_path, data)
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

    # rubocop:disable Metrics/AbcSize
    def render_system_page_meta_tags
      # Most tags have format system-page-meta-foo, but title tag is just: system-page-title
      title_tag = '<system-page-title/>'
      response.body = response.body.gsub(title_tag, @metadata_set.title)

      # Replace <system-page-meta-foo/> tags.
      @metadata_set.class.column_names.each do |name|
        meta_tag = format('<system-page-meta-%s/>', name)
        content = @metadata_set.send(name)
        html = content.nil? ? '' : format('<meta name="%s" content="%s"/>', name, content)
        response.body = response.body.gsub(meta_tag, html)
      end if @metadata_set
    end
    # rubocop:enable Metrics/AbcSize

    def build_assets_on_fly
      # It's not pretty but it works. I think.
      # See http://stackoverflow.com/a/9943895/6763239
      require 'rake'
      Rake::Task.clear # necessary to avoid tasks being loaded several times in dev mode
      CascadeAssetsRails::Application.load_tasks

      # This is what the Build :do_precompile task does.
      Rake::Task['assets:clobber'].invoke
      Rake::Task['assets:precompile'].invoke
    end
  end
end
