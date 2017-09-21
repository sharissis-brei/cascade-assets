class OmninavController < ApplicationController
  def demo
    builder = ::Omninav::Builder.new
    omninav_html = builder.build_html
    render html: omninav_html, layout: 'omninav'
  end

  # GET /omni_nav/omni_nav_v2(/:context)
  def demo_v2
    # params[:context] can be used to simulate different contexts (e.g. /omninav_v2/law)
    cascade_context = params[:context]

    # Umbrella Categories: this is hardcoded in the OmniNav velocity format in Cascade
    # Apparently this is a thing in Cascade. Kill me. See for instance the law home pages
    # where DOM tree goes:
    # body > div#theme.law > ... > div.cu-off-canvas-header > a.sc-logo.fowler
    umbrella_categories = [
      # [ directory (assume leading /), menu label, class/image id, path, brand text ]
      [ 'business', 'ARGYROS SCHOOL', 'asbe', 'business/index.aspx', 'Argyros School of Business' ],
      [ 'education', 'ATTALLAH COLLEGE', 'education', 'education/index.aspx' ],
      [ 'dodge', 'DODGE COLLEGE', 'dodge', 'dodge/index.aspx' ],
      [ 'crean', 'CREAN COLLEGE', 'crean', 'crean/index.aspx' ],
      [ 'wilkinson', 'WILKINSON COLLEGE', 'wilkinson', 'wilkinson/index.aspx' ],
      [ 'copa', 'CoPA', 'copa', 'copa/index.aspx' ],
      [ 'pharmacy', 'CUSP', 'cusp', 'pharmacy/index.aspx' ],
      [ 'law', 'FOWLER SCHOOL OF LAW', 'fowler', 'law/index.aspx', 'Fowler School of Law' ]
    ]

    # Set umbrella category. This is more-or-less how the Cascade format does it
    @page_umbrella_category = []
    umbrella_categories.each do | umbrella_category |
      @page_umbrella_category = umbrella_category if umbrella_category.first == cascade_context
    end

    render template: "omni_nav_v2/omninav", layout: 'omninav'
  end
end
