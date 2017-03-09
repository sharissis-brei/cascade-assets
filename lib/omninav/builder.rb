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
        login_html: build_login
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
%<login_html>s

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

    def build_login
      # TODO: Remove div#cu_login_form or only include it conditionally for the Blogs version,
      # as it appears that's the only site it's used on.
      template = <<-LOGIN_HTML
  <div class="cu_nav_menu" id="cu_login_container">
    <div id="cu_identity">
      <div id="omni-login">
        <span class="icon icon-user3"></span>
        <span class="cu_name">Log In</span>
      </div>
    </div>
    <div id="cu_login_form"
         class="cu_dropdown_menu"
         data-show-domain="blogs.chapman.edu"
         style="display: none;">
      <form action="https://blogs.chapman.edu/wp-login.php" method="post">
        <label for="cu_username" style="display: none;">ChapmanU User ID</label>
        <input id="cu_username"
               name="log"
               class="username"
               onblur="if (this.value == '') {this.value = 'ChapmanU User ID';}"
               onfocus="if (this.value == 'ChapmanU User ID') { this.value = ''; }"
               type="text"
               value="ChapmanU User ID" />
        <label for="cu_password" style="display: none;">Password</label>
        <input id="cu_password"
               name="pwd"
               class="password"
               onblur="if (this.value == '') { this.value = 'Password'; }"
               onfocus="if (this.value == 'Password') { this.value = ''; }"
               type="password"
               value="Password" />
        <input id="cu_submit" name="submit" type="submit" value="Log In" />
        <input class="persist" id="cu_persist" name="rememberme" type="checkbox" value="forever" />
        <label for="cu_persist">Remember Me</label>
      </form>
    </div>
    <ul class="cu_dropdown_menu">
      <li>
        <a class="cu_nav_button" href="https://blackboard.chapman.edu/">
          %<blackboard_svg>s
          Blackboard
        </a>
      </li>
      <li>
        <a class="cu_nav_button" href="https://my.chapman.edu/">
          %<chapman_svg>s
          MyChapman
        </a>
      </li>
      <li>
        <a class="cu_nav_button" href="https://exchange.chapman.edu/">
          %<email_svg>s
          Staff &amp; Faculty Email
        </a>
      </li>
      <li>
        <a class="cu_nav_button" href="http://www.chapman.edu/panthermail">
          %<email_svg>s
          PantherMail
        </a>
      </li>
      <li>
        <a class="cu_nav_button" href="https://mywindow.chapman.edu/">
          %<chapman_svg>s
          MyWindow
        </a>
      </li>
    </ul>
  </div>
LOGIN_HTML

      params = {
        blackboard_svg: svg_tag_for_blackboard,
        email_svg: svg_tag_for_email,
        chapman_svg: svg_tag_for_chapman_window
      }
      format(template, params)
    end

    #
    # SVG Logos
    #
    def svg_tag_for_email
      path_descriptions = [
        "M480,64H32C14.4,64,0,78.4,0,96v320c0,17.6,14.399,32,32,32h448c17.6,0,32-14.4,32-",
        "32V96C512,78.4,497.6,64,480,64zM448,128v23L256,264.143L64,151v-23H448z M64,384V2",
        "06.714l192,113.144l192-113.144V384H64z"]
      path_description = path_descriptions.join('')
      template = '<svg viewbox="0 0 512 512"><path d="%s"></path></svg>'
      format(template, path_description)
    end

    def svg_tag_for_chapman_window
      path_descriptions = [
        "M237.543,263.319L-0.266,501.073V263.319H237.543z M-0.266,248.073V10.26l237.81,23",
        "7.813H-0.266zM501.276-0.455L263.518,237.291V-0.455H501.276z M248.299,237.291L10.",
        "507-0.455h237.792V237.291z M274.291,248.073L512.032,10.26v237.813H274.291z M512.",
        "032,263.319v237.754L274.291,263.319H512.032z M248.299,274.025L10.507,511.831h237",
        ".792V274.025zM263.518,274.025v237.806h237.725L263.518,274.025z"]
      path_description = path_descriptions.join('')
      template = '<svg viewbox="0 0 512 512"><path d="%s"></path></svg>'
      format(template, path_description)
    end

    def svg_tag_for_blackboard
      # These descriptions were likely generated by some imaging tool.
      large_b_path_descriptions = [
        "M50.397,174.237c-3.241-62.081-49.365-34.905-50.363-56.097c-0.499-8.228,4.488-6.7",
        "31,7.729-6.981c1.745,0,4.986,1.247,26.179,0.25c39.143-2.244,76.542-5.735,113.939",
        "-7.729c110.949-5.984,114.439,60.834,114.937,70.558c1.496,29.42-13.463,54.601-45.",
        "376,66.319v1.745c56.097,9.973,73.798,33.658,76.042,74.298c3.242,60.336-35.403,99",
        ".978-108.704,103.966c-66.818,3.74-89.755,3.241-112.444,4.488c-11.469,0.498-22.68",
        "8,2.992-32.412,3.491c-9.724,0.498-14.71,0.747-14.959-5.735c-0.748-14.709,38.895-",
        "5.485,36.65-49.365L50.397,174.237L50.397,174.237z M108.49,220.112c1.246,21.191,6",
        ".233,24.184,32.412,24.434l26.179-1.496c34.157-1.747,46.374-20.444,44.628-53.106c",
        "-2.493-42.384-36.65-68.313-77.29-66.07c-29.42,1.496-30.168,17.951-28.672,44.13L1",
        "08.49,220.112L108.49,220.112zM115.471,350.507c2.244,42.384,14.46,54.851,58.341,5",
        "2.357c44.13-2.493,65.322-32.91,62.829-77.04c-1.496-26.179-16.705-66.07-98.232-61",
        ".582c-26.179,1.495-27.176,12.965-25.93,35.651L115.471,350.507L115.471,350.507z"
      ]
      small_b_path_descriptions = [
        "M321.908,138.085c-1.745-32.661-28.423-11.469-29.42-27.924c-0.499-11.469,20.943-5",
        ".983,61.832-34.406c3.241-1.745,4.736-3.491,7.978-3.74c4.986-0.249,3.74,9.724,3.9",
        "9,12.965l9.723,177.766c16.954-17.203,35.902-32.909,58.591-34.156c52.108-2.742,74",
        ".298,41.637,75.794,72.802c3.739,68.563-33.41,106.46-88.759,109.452c-40.64,2.244-",
        "54.851-14.96-61.333-14.711c-8.228,0.499-11.968,18.7-21.94,19.198c-3.241,0.249-4.",
        "986-1.246-5.235-4.737c-0.25-3.241,2.493-13.214,1.246-36.151L321.908,138.085L321.",
        "908,138.085z M380.748,350.756c1.994,37.398,36.65,43.881,49.864,43.133c37.398-1.9",
        "94,43.631-38.396,42.136-67.566c-1.745-34.156-19.946-65.82-62.331-63.577c-12.964,",
        "0.749-33.658,9.973-32.91,26.429L380.748,350.756L380.748,350.756z"]
      large_b_path = large_b_path_descriptions.join('')
      small_b_path = small_b_path_descriptions.join('')
      template = '<svg viewbox="0 0 512 512"><path d="%s"></path><path d="%s"></path></svg>'
      format(template, small_b_path, large_b_path)
    end
  end
end