#
# ContentTypes::SchoolHomePagesController
#
# This controller models the content type used by the Law School in Cascade. This content type
# and its template are in the process of being deprecated but still need to be supported.
#
# For more information on the ContentType controller pattern, see the ModularController.
#
module ContentTypes
  class SchoolHomePagesController < ApplicationController
    layout false
    before_action :link_static_assets
    after_action :link_static_assets, :render_region_tags, :render_system_page_meta_tags

    # GET /school_home_pages/slideshow or /school_home_pages/law
    # Maps to Content Types/School Home Pages/Slideshow in Cascade.
    # rubocop:disable Metrics/MethodLength
    def slideshow
      @configuration_set = ConfigurationSet.slideshow
      @metadata_set = MetadataSet.page(title: 'Slideshow Page')
      @data_definition = DataDefinitions::Slideshow.default

      # Define configuration set regions. This mimics the regions section of Configuation Set
      # properties view in Cascade.
      @configuration_set.regions = {
        # Empty Regions
        'ADDITIONAL BODY AT-END' => '',
        'ADDITIONAL HEAD' => '',
        'CSS' => '',
        'FORM_VALIDATION' => '',

        # Dynamic Regions
        'COMMON STYLES' => cascade_block('_cascade/blocks/html/common_styles'),
        'COMMON SCRIPTS' => cascade_block('_cascade/blocks/html/common_scripts'),
        'CUSTOM THEME' => cascade_block('_cascade/blocks/custom_themes/law'),
        'GLOBAL FOOTER' => cascade_block('_cascade/blocks/html/law_footer'),
        'META VIEWPORT' => cascade_block('_cascade/blocks/html/global_meta_viewport'),

        # TODO: convert these as needed.
        'BREADCRUMBS' => 'TODO: _cascade/formats/level/Breadcrumbs',
        'GOOGLE_ANALYTICS' => '<!-- TODO: _chapman_common:_cascade/blocks/ANALYTICS-TRACKING -->',
        'JUMP LINK' => '<!-- TODO: _cascade/templates/Jump Link -->',
        'LEFT COLUMN CALLOUT' => 'TODO: _cascade/formats/level/LeftColumnCallout',
        'LEFT COLUMN NEWS EVENTS' => 'TODO: _cascade/blocks/html/Left Column News Events',
        'LEFT NAV' => 'TODO: _cascade/formats/level/LeftNav',
        'NAME BAR' => 'TODO: _cascade/formats/school home pages/NameBar',
        'NEWS EVENTS' => 'TODO: _cascade/formats/level/News',
        'OG_TAGS' => '<!-- TODO: _cascade/formats/Open Graph And Canonical Tags -->',
        'SLIDES' => 'TODO: _cascade/formats/school home pages/slideshow/slides',
        'SOCIAL_ACCOUNTS' => 'TODO: _cascade/formats/level/social_accounts',

        # TODO: convert these to cascade_format action.
        'OMNI-NAV' => render_static_partial('widgets/shared/omninav'),
        'NAVIGATION' => render_static_partial('widgets/shared/navigation'),
        'PRIMARY CONTENT' => '<h2>PRIMARY CONTENT GOES HERE!</h2>'
      }

      render @configuration_set.template
    end
    # rubocop:enable Metrics/MethodLength
  end
end
