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
    #
    #
    DOMAIN = 'https://www.chapman.edu/'.freeze

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
        logo_html: build_logo,
        search_html: build_search,
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
%<search_html>s

</div>
<!-- End OmniNav NavBar -->

NAVBAR_HTML
    end

    def build_logo
      template = <<-LOGO_HTML
  <!-- Logo Block -->
  <a class="cu-logo" href="%<domain>s" title="Chapman University Website Home Page">
    <span itemprop="name">Chapman University</span>
  </a>
LOGO_HTML

      params = {
        domain: DOMAIN
      }
      format(template, params)
    end

    def build_search
      template = <<-SEARCH_HTML
  <!-- Search Trigger (Only displayed in mobile.) -->
  <div class="cu-search-open-trigger" id="js-cu-search-open-trigger">
    <span>Search</span>
  </div>

  <!-- Search Block -->
  <div id="cu_search">
    <select class="search-type" name="search-type" id="search-type" aria-label="search type">
      <option value="All">All</option>
      <option value="Blog Stories">Blog Stories</option>
      <option value="Faculty Directory">Faculty Directory</option>
      <option value="Events">Events</option>
    </select>

    <div id="cu_search_box">
      <form action="%<domain>ssearch-results/index.aspx">
        <table cellpadding="0" cellspacing="0" class="gsc-search-box">
          <tbody>
            <tr>
              <td class="gsc-input">
                <input type="text"
                       id="cu_search_no_js"
                       name="q"
                       class="gsc-input no-js"
                       placeholder="Search"
                       autocomplete="off"
                       size="10"
                       spellcheck="false"
                       style="outline: none;" />
              </td>
              <td class="gsc-search-button">
                <input class="gsc-search-button" title="search" type="button" value="Search" />
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    </div>

    <div id="cu_search_results">
      <div id="cu_search_results_cell">
        <div id="cu_search_results_ui"></div>
      </div>
    </div>
  </div>
SEARCH_HTML

      params = {
        domain: DOMAIN
      }
      format(template, params)
    end
  end
end