class ContentTypes::ModularController < ApplicationController
  # GET /modular/one_column
  # Maps to Content Types/Modular/1 Column in Cascade.
  def one_column
    # System regions mapping to blocks (with and without formatting).
    @blocks = {
      # Without formats:
      cascade_assets: nil,
      fb_js_sdk: nil,
      global_footer: nil,
      google_analytics: nil,
      jquery: nil,
      jump_link: nil,
      meta_viewport: nil,

      # With formats:
      masthead: nil,
      navigation: nil,
      og_tags: nil,
      omninav: nil,
      primary_content: nil
    }

    # System regions mapping to formats without blocks.
    @formats = {
      page_wrapper_close: nil,
      page_wrapper_open: nil
    }

    render plain: 'TODO'
  end
end
