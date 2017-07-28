class OmninavController < ApplicationController
  def demo
    builder = ::Omninav::Builder.new
    omninav_html = builder.build_html
    render html: omninav_html, layout: 'omninav'
  end

  def demo_v2
    render template: "omni_nav/omni_nav_v2", layout: 'omninav'
  end
end
