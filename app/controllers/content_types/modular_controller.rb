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
      # Link static assets for test photo.
      # For https://github.com/chapmanu/cascade-assets/issues/126
      link_static_assets

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
    # rubocop:disable Metrics/MethodLength, Metrics/AbcSize
    def one_column
      @configuration_set = ConfigurationSet.one_column
      @metadata_set = MetadataSet.page(title: 'Modular One Column')
      @data_definition = DataDefinitions::OneColumn.default

      theme = params.fetch(:theme, 'students')
      @current_page_path = "#{theme}/path/to/index.aspx"

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
        'PAGE WRAPPER CLOSE' => cascade_format('_cascade/formats/modular/page_wrapper_close'),
        'PAGE WRAPPER OPEN' => cascade_format('_cascade/formats/modular/page_wrapper_open'),

        # TODO: convert these to cascade_format action.
        'OMNI-NAV' => render_static_partial('widgets/shared/omninav'),
        'NAVIGATION' => render_static_partial(navigation_path),
        'PRIMARY CONTENT' => render_static_one_column_primary_content,
        'GLOBAL FOOTER' => render_static_partial(footer_path)
      }

      render @configuration_set.template
    end
    # rubocop:enable Metrics/MethodLength, Metrics/AbcSize

    # GET /modular/two_column
    # Maps to Content Types/Modular/2 Column in Cascade.
    # rubocop:disable Metrics/MethodLength, Metrics/AbcSize
    def two_column
      # Cascade Data Models
      @configuration_set = ConfigurationSet.two_column
      @metadata_set = MetadataSet.page(title: 'Modular Two Column')
      @data_definition = DataDefinitions::TwoColumn.default

      # Set dynamic values. We need to map URL params (with their parameterized format) to
      # the values we use in Cascade (which are user-ended English in format).
      # If these options expand in future, we'll probably want to abstract this into its
      # own method.
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
        'LEFT COLUMN CONTENT' => render_static_two_column_left_column,
        'MASTHEAD' => cascade_format('_cascade/formats/level/masthead'),
        'META VIEWPORT' => cascade_block('_cascade/blocks/html/global_meta_viewport'),
        'OG_TAGS' => '<!-- TODO: _cascade/formats/Open Graph And Canonical Tags -->',
        'PAGE WRAPPER CLOSE' => cascade_format('_cascade/formats/modular/page_wrapper_close'),
        'PAGE WRAPPER OPEN' => cascade_format('_cascade/formats/modular/page_wrapper_open'),
        'PRIMARY CONTENT' => render_static_two_column_primary_content,
        'SOCIAL ACCOUNTS' => 'TODO: _cascade/formats/level/social_accounts',

        # TODO: convert these to cascade_format action.
        'OMNI-NAV' => render_static_partial('widgets/shared/omninav'),
        'NAVIGATION' => render_static_partial(navigation_path),
        'GLOBAL FOOTER' => render_static_partial(footer_path)
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
        'LEFT COLUMN CONTENT' => render_static_three_column_left_column,
        'LEFT NAV' => 'TODO: _cascade/formats/level/LeftNav_Velocity',
        'MASTHEAD' => cascade_format('_cascade/formats/level/masthead'),
        'META VIEWPORT' => cascade_block('_cascade/blocks/html/global_meta_viewport'),
        'OG_TAGS' => '<!-- TODO: _cascade/formats/Open Graph And Canonical Tags -->',
        'PAGE WRAPPER CLOSE' => cascade_format('_cascade/formats/modular/page_wrapper_close'),
        'PAGE WRAPPER OPEN' => cascade_format('_cascade/formats/modular/page_wrapper_open'),
        'PRIMARY CONTENT' => render_static_three_column_primary_content,
        'RIGHT COLUMN CONTENT' => render_static_three_column_right_column,
        'SOCIAL ACCOUNTS' => 'TODO: _cascade/formats/level/social_accounts',

        # TODO: convert these to cascade_format action.
        'GLOBAL FOOTER' => render_static_partial('_cascade/blocks/html/footer'),
        'NAVIGATION' => render_static_partial('widgets/shared/navigation'),
        'OMNI-NAV' => render_static_partial('widgets/shared/omninav')
      }

      render @configuration_set.template
    end
    # rubocop:enable Metrics/MethodLength, Metrics/AbcSize

    private

    def footer_path
      if params['theme'] == 'law'
        '_cascade/blocks/html/law_footer'
      else
        '_cascade/blocks/html/footer'
      end
    end

    def navigation_path
      if params['theme'] == 'law'
        '_cascade/blocks/html/law_header'
      else
        'widgets/shared/navigation'
      end
    end

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

    def render_static_one_column_primary_content
      # This reproduces content from static sample version
      format("%s %s %s %s %s",
             render_static_partial('widgets/single_column/call_to_action_block'),
             render_static_partial('widgets/single_column/chapman_events_feed'),
             render_static_partial('widgets/single_column/messaging_1_column_facts'),
             render_static_partial('widgets/single_column/messaging_2_column_youtube_video'),
             render_static_partial('widgets/single_column/messaging_2_column_vimeo_video'))
    end

    def render_static_two_column_primary_content
      # This reproduces content from static sample version
      format("%s %s %s %s %s %s %s %s %s %s %s %s",
             render_static_partial('widgets/primary_content/wysiwyg_editor_3'),
             render_static_partial('widgets/primary_content/collapsables_1'),
             render_static_partial('widgets/primary_content/collapsables_2'),
             render_static_partial('widgets/primary_content/collapsables_3'),
             render_static_partial('widgets/primary_content/funnel_1up_boxes_1'),
             render_static_partial('widgets/primary_content/funnel_2up_boxes_1'),
             render_static_partial('widgets/primary_content/personnel_region_1'),
             render_static_partial('widgets/primary_content/personnel_region_2'),
             render_static_partial('widgets/primary_content/form_1'),
             render_static_partial('widgets/primary_content/logo_image_rotator_1'),
             render_static_partial('widgets/primary_content/featured_news_events_feed_1'),
             render_static_partial('widgets/primary_content/wysiwyg_anchor_links'))
    end

    def render_static_two_column_left_column
      # This reproduces content from the static sample version
      format("%s %s %s",
             render_static_partial('widgets/left_column/callout_1'),
             render_static_partial('widgets/left_column/callout_2'),
             render_static_partial('widgets/left_column/news_event_left_col'))
    end

    # rubocop:disable Metrics/AbcSize
    def render_static_three_column_primary_content
      # This reproduces content from static sample version
      format("%s %s %s %s %s %s %s %s %s %s %s %s %s %s %s",
             render_static_partial('widgets/primary_content/wysiwyg_editor_3'),
             render_static_partial('widgets/primary_content/collapsables_1'),
             render_static_partial('widgets/primary_content/collapsables_2'),
             render_static_partial('widgets/primary_content/funnel_1up_boxes_1'),
             render_static_partial('widgets/primary_content/funnel_2up_boxes_1'),
             render_static_partial('widgets/primary_content/carousel_1'),
             render_static_partial('widgets/primary_content/carousel_2'),
             render_static_partial('widgets/primary_content/form_1'),
             render_static_partial('widgets/primary_content/personnel_region_1'),
             render_static_partial('widgets/primary_content/personnel_region_2'),
             render_static_partial('widgets/primary_content/tabs_1'),
             render_static_partial('widgets/primary_content/three_photo_callout_1'),
             render_static_partial('widgets/primary_content/twitter_feed_1'),
             render_static_partial('widgets/primary_content/logo_image_rotator_1'),
             render_static_partial('widgets/primary_content/featured_news_events_feed_1'))
    end
    # rubocop:enable Metrics/AbcSize

    def render_static_three_column_left_column
      # This reproduces content from static sample version
      format("%s %s %s %s %s %s",
             render_static_partial('widgets/left_column/callout_1'),
             render_static_partial('widgets/left_column/callout_2'),
             render_static_partial('widgets/left_column/callout_3'),
             render_static_partial('widgets/left_column/calls_to_action_1'),
             render_static_partial('widgets/left_column/calls_to_action_2'),
             render_static_partial('widgets/left_column/news_events_1'))
    end

    def render_static_three_column_right_column
      # This reproduces content from static sample version
      format("%s %s %s %s %s %s %s",
             render_static_partial('widgets/right_column/action_buttons'),
             render_static_partial('widgets/right_column/callout_box_1'),
             render_static_partial('widgets/right_column/callout_box_2'),
             render_static_partial('widgets/right_column/flickr_gallery'),
             render_static_partial('widgets/right_column/picasa_gallery'),
             render_static_partial('widgets/right_column/simple_form'),
             render_static_partial('widgets/right_column/logo_image_rotator_1'))
    end
    # rubocop:enable Metrics/MethodLength
  end
end
