#
# OmniNav is the navbar that is used across multiple Chapman websites to provide a consistent,
# unified experience. The markup and assets need to be integrated in multiple independent
# projects, like Inside and Blogs.
#
# This class is used by the rake build task to build omninav for each of the projects that
# require it. It consolidates OmniNav development and updates in this one module.
#
module Omninav
  class Builder
    #
    # Class Methods
    #

    #
    # Instance Methods
    #
    def initialize
    end

    def build
      # TODO: Format using named parameters.
      # See http://stackoverflow.com/questions/196841
      sections = {
        logo_html: build_logo
      }
      format(navbar_template, sections)
    end

    private

    #
    # Markup Methods
    #
    # Note: when updating navbar markup, you will most likely be changing one of these
    # methods.
    #
    def navbar_template
      <<-NAVBAR_HTML

<!-- OmniNav NavBar -->
<div id="cu_nav" class="use-transitions">

%<logo_html>s

</div>
<!-- End OmniNav NavBar -->

NAVBAR_HTML
    end

    def build_logo
      <<-LOGO_HTML
  <a class="cu-logo" href="https://www.chapman.edu/" title="Chapman University Website Home Page">
    <span itemprop="name">Chapman University</span>
  </a>
LOGO_HTML
    end
  end
end