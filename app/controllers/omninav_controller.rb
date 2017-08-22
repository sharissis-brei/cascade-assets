class OmninavController < ApplicationController
  def demo
    builder = ::Omninav::Builder.new
    omninav_html = builder.build_html
    render html: omninav_html, layout: 'omninav'
  end

  # GET /omni_nav/omni_nav_v2(/:context)
  def demo_v2
    # params[:context] can be used to simulate different contexts (e.g. /omninav_v2/law)
    @branding_class = params[:context].nil? ? 'unbranded' : 'branded'
    render template: "omni_nav/omni_nav_v2", layout: 'omninav'
  end
end
