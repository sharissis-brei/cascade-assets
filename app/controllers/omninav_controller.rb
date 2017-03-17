class OmninavController < ApplicationController
  def demo
    builder = ::Omninav::Builder.new
    omninav_html = builder.build
    render html: omninav_html.html_safe, layout: 'omninav'
  end
end
