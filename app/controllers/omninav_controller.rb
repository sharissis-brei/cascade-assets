class OmninavController < ApplicationController
  def demo
    builder = ::Omninav::Builder.new
    omninav_html = builder.build_html
    render html: omninav_html, layout: 'omninav'
  end

  # GET /omni_nav/omni_nav_v2(/:context)
  def demo_v2
    # params[:context] can be used to simulate different contexts (e.g. /omninav_v2/law)
    @theme_class = params[:context]

    # Apparently this is a thing in Cascade. Kill me. See for instance the law home pages
    # where DOM tree goes:
    # body > div#theme.law > ... > div.cu-off-canvas-header > a.sc-logo.fowler
    theme_logo_map = {
      # theme class => logo class
      'business' => 'asbe',
      'law' => 'fowler'
    }
    @logo_class = theme_logo_map.fetch(@theme_class, 'default-logo-cu')

    # I believe the identification of the following variables will have to be added
    # to Cascade (in the velocity format?) for OmniNav v2.
    theme_brand_map = {
      # theme class => brand_text
      'law' => 'Fowler School of Law'
    }
    @brand_text = theme_brand_map.fetch(@theme_class, '')

    @brand_class = params[:context].nil? ? 'unbranded' : 'branded'

    render template: "omni_nav_v2/omninav", layout: 'omninav'
  end
end
