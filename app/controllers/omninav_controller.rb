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
    url_theme_map = {
      # theme class => logo class
      'business' => 'asbe',
      'law' => 'fowler'
    }
    @logo_class = url_theme_map.fetch(@theme_class, 'default-logo-cu')

    # I believe the innovation of this selector is new with OmniNav v2
    @branding_class = params[:context].nil? ? 'unbranded' : 'branded'

    render template: "omni_nav_v2/omninav", layout: 'omninav'
  end
end
