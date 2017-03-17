class OmninavController < ApplicationController
  def demo
    builder = ::Omninav::Builder.new
    omninav_html = builder.build
    render html: omninav_html, layout: 'omninav'
  end
end
