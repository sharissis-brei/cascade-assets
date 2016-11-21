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

      # Define configuration set regions.
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
        'OG_TAGS' => '',
        'PAGE WRAPPER CLOSE' => '',
        'PAGE WRAPPER OPEN' => '',

        # TODO: convert these to cascade_format action.
        'OMNI-NAV' => render_static_partial('widgets/shared/omninav'),
        'NAVIGATION' => render_static_partial('widgets/shared/navigation'),
        'PRIMARY CONTENT' => '<h2>PRIMARY CONTENT GOES HERE!</h2>',
        'GLOBAL FOOTER' => render_static_partial('widgets/shared/footer')
      }

      render @configuration_set.template
    end
    # rubocop:enable Metrics/MethodLength

    # GET /modular/two_column
    # Maps to Content Types/Modular/2 Column in Cascade.
    # rubocop:disable Metrics/MethodLength, Metrics/AbcSize
    def two_column
      # Cascade Data Models
      @configuration_set = ConfigurationSet.two_column
      @metadata_set = MetadataSet.page(title: 'Modular Two Column')
      @data_definition = DataDefinitions::TwoColumn.default

      # Set dynamic values.
      if params[:masthead] == 'branded-old'
        @data_definition.set_value(:masthead_type, 'Branded Masthead')
      elsif params[:masthead] == 'slider-old'
        @data_definition.set_value(:masthead_type, 'Slider')
      elsif params[:masthead] == 'slider'
        @data_definition.set_value(:masthead_type, 'Slider - New')
      else
        @data_definition.set_value(:masthead_type, 'Branded - New')
      end

      # Set theme dynamically.
      theme = params.fetch(:theme, 'students')
      @current_page_path = "#{theme}/path/to/index.aspx"

      # Set regions.
      @configuration_set.regions = {
        # Blank Regions
        'ADDITIONAL BODY AT-END' => '',
        'ADDITIONAL HEAD' => '',

        # Dynamic Regions
        'BREADCRUMBS' => 'TODO: _cascade/formats/level/Breadcrumbs',
        'CASCADE ASSETS' => cascade_block('_cascade/blocks/html/cascade_assets'),
        'FB_JS_SDK' => cascade_block('_cascade/blocks/html/facebook_javascript_sdk'),
        'GOOGLE_ANALYTICS' => '<!-- _chapman_common:_cascade/blocks/ANALYTICS-TRACKING -->',
        'JQUERY' => cascade_block('_cascade/blocks/html/jquery'),
        'JUMP LINK' => cascade_block('_cascade/blocks/html/jump_link'),
        'LEFT COLUMN CONTENT' => 'TODO: _cascade/formats/modular/LeftColumnContent',
        'MASTHEAD' => cascade_format('_cascade/formats/level/masthead'),
        'META VIEWPORT' => cascade_block('_cascade/blocks/html/global_meta_viewport'),
        'OG_TAGS' => '<!-- TODO: _cascade/formats/Open Graph And Canonical Tags -->',
        'PAGE WRAPPER CLOSE' => cascade_format('_cascade/formats/modular/page_wrapper_close'),
        'PAGE WRAPPER OPEN' => cascade_format('_cascade/formats/modular/page_wrapper_open'),
        'PRIMARY CONTENT' => '<h2>TODO: _cascade/formats/modular/PrimaryContent</h2>',
        'SOCIAL ACCOUNTS' => 'TODO: _cascade/formats/level/social_accounts',

        # TODO: convert these to cascade_format action.
        'OMNI-NAV' => render_static_partial('widgets/shared/omninav'),
        'NAVIGATION' => render_static_partial('widgets/shared/navigation'),
        'GLOBAL FOOTER' => render_static_partial('widgets/shared/footer')
      }

      render @configuration_set.template
    end
    # rubocop:enable Metrics/MethodLength, Metrics/AbcSize

    # GET /modular/three_column
    # Maps to Content Types/Modular/3 Column in Cascade.
    # rubocop:disable Metrics/MethodLength, Metrics/AbcSize
    def three_column
      # Cascade Data Models
      @configuration_set = ConfigurationSet.three_column
      @metadata_set = MetadataSet.page(title: 'Modular Three Column')
      @data_definition = DataDefinitions::ThreeColumn.default

      # Set dynamic values.
      if params[:masthead] == 'branded-old'
        @data_definition.set_value(:masthead_type, 'Branded Masthead')
      elsif params[:masthead] == 'slider'
        @data_definition.set_value(:masthead_type, 'Slider - New')
      else
        @data_definition.set_value(:masthead_type, 'Branded - New')
      end

      # Set theme dynamically.
      theme = params.fetch(:theme, 'students')
      @current_page_path = "#{theme}/path/to/index.aspx"

      # Set regions.
      @configuration_set.regions = {
        # Blank Regions
        'ADDITIONAL BODY AT-END' => '',
        'ADDITIONAL HEAD' => '',

        # Dynamic Regions
        'BREADCRUMBS' => 'TODO: _cascade/formats/level/Breadcrumbs',
        'CASCADE ASSETS' => cascade_block('_cascade/blocks/html/cascade_assets'),
        'FB_JS_SDK' => cascade_block('_cascade/blocks/html/facebook_javascript_sdk'),
        'FEATURED NEWS EVENTS FEEDS' => 'TODO: _cascade/formats/modular/meta/' \
                                        'Featured News Events Feeds',
        'GOOGLE_ANALYTICS' => '<!-- _chapman_common:_cascade/blocks/ANALYTICS-TRACKING -->',
        'JQUERY' => cascade_block('_cascade/blocks/html/jquery'),
        'JUMP LINK' => cascade_block('_cascade/blocks/html/jump_link'),
        'LEFT COLUMN CONTENT' => 'TODO: _cascade/formats/modular/LeftColumnContent',
        'LEFT NAV' => 'TODO: _cascade/formats/level/LeftNav_Velocity',
        'MASTHEAD' => cascade_format('_cascade/formats/level/masthead'),
        'META VIEWPORT' => cascade_block('_cascade/blocks/html/global_meta_viewport'),
        'OG_TAGS' => '<!-- TODO: _cascade/formats/Open Graph And Canonical Tags -->',
        'PAGE WRAPPER CLOSE' => cascade_format('_cascade/formats/modular/page_wrapper_close'),
        'PAGE WRAPPER OPEN' => cascade_format('_cascade/formats/modular/page_wrapper_open'),
        'PRIMARY CONTENT' => '<h2>TODO: _cascade/formats/modular/PrimaryContent</h2>',
        'RIGHT COLUMN CONTENT' => 'TODO: _cascade/formats/modular/RightColumnContent',
        'SOCIAL ACCOUNTS' => 'TODO: _cascade/formats/level/social_accounts',

        # TODO: convert these to cascade_format action.
        'GLOBAL FOOTER' => render_static_partial('widgets/shared/footer'),
        'NAVIGATION' => render_static_partial('widgets/shared/navigation'),
        'OMNI-NAV' => render_static_partial('widgets/shared/omninav')
      }

      render @configuration_set.template
    end
    # rubocop:enable Metrics/MethodLength, Metrics/AbcSize

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
  end
end
