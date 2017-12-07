class OmninavController < ApplicationController
  def demo
    builder = ::Omninav::Builder.new
    omninav_html = builder.build_html
    render html: omninav_html, layout: 'omninav'
  end

  # GET /omninav_v2(/:template)(/:theme)
  def demo_v2

    # Umbrella Categories: this is hardcoded in the OmniNav velocity format in Cascade
    # Apparently this is a thing in Cascade. Kill me. See for instance the law home pages
    # where DOM tree goes:
    # body > div#theme.law > ... > div.cu-off-canvas-header > a.sc-logo.fowler
    umbrella_categories = [
      # [ directory (assume leading /), menu label, class/image id ]
      [ 'business', 'Argyros School', 'asbe' ],
      [ 'education', 'Attallah College', 'education' ],
      [ 'dodge', 'Dodge College', 'dodge' ],
      [ 'crean', 'Crean College', 'crean' ],
      [ 'wilkinson', 'Wilkinson College', 'wilkinson' ],
      [ 'copa', 'College of Performing Arts', 'copa' ],
      [ 'pharmacy', 'School of Pharmacy', 'cusp' ],
      [ 'law', 'Fowler School', 'fowler' ],
      [ 'scst', 'Schmid College', 'schmid' ],
      [ 'communication', 'School of Communication', 'soc' ],
      [ 'about', 'About', 'default' ],
      [ 'academics', 'Academics', 'default' ],
      [ 'admission', 'Admission', 'default' ],
      [ 'alumni', 'Alumni', 'default' ],
      [ 'campus-services', 'Campus Services', 'default' ],
      [ 'campus-services/career-development', 'Career', 'default' ],
      [ 'faculty-staff', 'Faculty and Staff', 'default' ],
      [ 'families', 'Families', 'default' ],
      [ 'research', 'Research', 'default' ],
      [ 'students', 'Students', 'default' ],
      [ 'support-chapman', 'Support Chapman', 'default' ]
    ]

    # Ex. localhost:5000/omninav_v2/1col/law
    view_template = params[:template]
    view_theme = params[:theme]

    umbrella_categories.each do | umbrella_category |
      @page_umbrella_category = umbrella_category if umbrella_category.first == view_theme
    end

    render template: "omni_nav_v2/omninav", layout: 'omninav_' + view_template
  end
end
