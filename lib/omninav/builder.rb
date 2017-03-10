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
    # Constants
    #
    DOMAIN = 'https://www.chapman.edu/'.freeze

    attr_accessor :target

    #
    # Class Methods
    #

    #
    # Instance Methods
    #
    def initialize(params = {})
      @target = params.fetch(:target, 'static')
    end

    def build
      # TODO: Format using named parameters.
      # See http://stackoverflow.com/questions/196841
      sections = {
        logo_html: build_logo,
        search_html: build_search,
        login_html: build_login,
        off_canvas_nav_html: build_off_canvas_nav
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
%<off_canvas_nav_html>s

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

    def build_off_canvas_nav
      template = <<-OFF_CANVAS_HTML
  <!-- Off Canvas Nav Trigger -->
  <a id="js-cu-off-canvas-nav-trigger"
     class="cu-off-canvas-nav-trigger"
     href="#"
     title="Access links to the pages within this section of the website and to other sections of the website">
    <span class="icon icon-menu7"></span>
  </a>

  <!-- Off Canvas Nav -->
  <div class="cu-off-canvas-overlay" id="js-cu-off-canvas-overlay"></div>

  <div class="cu-off-canvas-nav-container" id="js-cu-off-canvas-nav-container">
    %<off_canvas_header>s
    %<off_canvas_body>s
  </div>
  <!-- End Off Canvas Nav -->

OFF_CANVAS_HTML
      params = {
        off_canvas_header: build_off_canvas_nav_header,
        off_canvas_body: build_off_canvas_nav_body
      }
      format(template, params)
    end

    def build_off_canvas_nav_header
      # TODO: need to map output to target.
      if target == 'cascade'
        off_canvas_nav_header_for_cascade
      else
        off_canvas_nav_header_default
      end
    end

    def build_off_canvas_nav_body
      if target == 'cascade'
        off_canvas_nav_body_for_cascade
      else
        off_canvas_nav_body_default
      end
    end

    #
    # Off-Canvas Nav Headers
    #
    def off_canvas_nav_header_default
      <<-OFF_CANVAS_HEADER_HTML
    <div class="cu-off-canvas-header">
      <a class="default-logo-cu" href="#" title="Chapman University">
        <span itemprop="name">Chapman University</span>
      </a>
      <span id="js-cu-close-off-canvas-nav" class="close">X</span>
      <div class="cu-off-canvas-links clearfix">
        <span id="js-main-menu" class="main-menu">Main Menu</span>
      </div>
    </div>
OFF_CANVAS_HEADER_HTML
    end

    def off_canvas_nav_header_for_cascade
      template = <<-OFF_CANVAS_HEADER_HTML
    <div class="cu-off-canvas-header">
      #if ( $displaySecondaryMenu )
        #if ( $umbrellaCatsPaths.get($counter) == "/" )
          <a class="sc-logo"
             href="site://Chapman.edu/index"
             title="Link to Chapman University Homepage">
            <span itemprop="name">Chapman University</span>
          </a>
        #else
          <a class="sc-logo ${umbrellaCatsClasses.get($counter)}"
             href="${site}${umbrellaCatsPaths.get($counter)}"
             title="Link to ${umbrellaCats.get($counter)}">
            <span itemprop="name">${umbrellaCats.get($counter)} Logo</span>
          </a>
        #end

        <a class="default-logo"
           href="site://Chapman.edu/index"
           title="Link to Chapman University Homepage">
          <span itemprop="name">Chapman University</span>
        </a>

      #else
        <a href="site://Chapman.edu/index"
           class="default-logo-cu"
           title="Link to Chapman University Homepage">
          <span itemprop="name">Chapman University</span>
        </a>
      #end

      <span class="close" id="js-cu-close-off-canvas-nav">X</span>

      <div class="cu-off-canvas-links clearfix">
        #if ( $displaySecondaryMenu )
          <span id="js-main-menu" class="main-menu">$umbrellaCats.get($counter)</span>
        #else
          <span id="js-main-menu" class="main-menu">Main Menu</span>
        #end

        ## If an umbrella category, display toggle links
        #if ( $displaySecondaryMenu )
          <a id="js-level-2-link" href="#" class="level-2-link">
            &#8592; Go to <span class="accent">$umbrellaCats.get($counter) Menu</span>
          </a>
          <a id="js-level-1-link" href="#" class="level-1-link">
            Go to <span class="accent">Main Menu</span> &#8594;
          </a>
        #end
      </div>
    </div>
OFF_CANVAS_HEADER_HTML
    end

    def off_canvas_nav_body_for_cascade
      '<!-- TODO: Paste Cascade markup here. -->'
    end

    def off_canvas_nav_body_default
      template = <<-OFF_CANVAS_NAV_BODY_HTML
    <div class="cu-off-canvas-nav clearfix" id="js-cu-off-canvas-nav">
      <ul class="level-1">
        <li>
          <a class="has-icon" href="https://www.chapman.edu/" title="The University">
            %<chapman_window_svg>s
            The University
          </a>
          <span class="toggle"><span>+</span></span>
          <ul>
            <li><a href="https://www.chapman.edu/about/" title="About">About</a></li>
            <li><a href="https://www.chapman.edu/academics/" title="Academics">Academics</a></li>
            <li><a href="https://www.chapman.edu/admission/" title="Admission">Admission</a></li>
            <li><a href="https://www.chapman.edu/arts/" title="Arts">Arts</a></li>
            <li><a href="https://www.chapman.edu/campus-life/" title="Campus Life">Campus Life</a></li>
            <li><a href="https://www.chapman.edu/research-and-institutions/" title="Research">Research</a></li>
            <li><a href="https://www.chapman.edu/support-chapman/" title="Support">Support</a></li>
          </ul>
        </li>
        <li>
          <a class="has-icon" href="https://www.chapman.edu/audiences/" title="Find information for...">
            %<user_svg>s
            Find information for...
          </a>
          <span class="toggle"><span>+</span></span>
          <ul>
            <li><a href="https://www.chapman.edu/future-students/" title="Prospective Students">Prospective Students</a></li>
            <li><a href="https://www.chapman.edu/students/" title="Current Students">Current Students</a></li>
            <li><a href="https://www.chapman.edu/alumni/" title="Alumni">Alumni</a></li>
            <li><a href="https://www.chapman.edu/faculty-staff/" title="Faculty &amp; Staff">Faculty &amp; Staff</a></li>
            <li><a href="https://www.chapman.edu/families/" title="Parents &amp; Families">Parents &amp; Families</a></li>
          </ul>
        </li>
        <li>
          <a class="has-icon" href="https://www.chapman.edu/academics/degrees-and-programs.aspx" title="Degrees &amp; Programs">
            %<graduation_cap_svg>s
            Degrees &amp; Programs
          </a>
        </li>
        <li>
          <a class="has-icon" href="https://www.chapman.edu/academics/schools-colleges.aspx" title="Schools &amp; Colleges">
            %<building_svg>s
            Schools &amp; Colleges
          </a>
          <span class="toggle"><span>+</span></span>
          <ul>
            <li><a href="https://www.chapman.edu/business/" title="Argyros School of Business &amp; Economics">Argyros School of Business &amp; Economics</a></li>
            <li><a href="https://www.chapman.edu/ces/" title="College of Educational Studies">College of Educational Studies</a></li>
            <li><a href="https://www.chapman.edu/copa/" title="College of Performing Arts">College of Performing Arts</a></li>
            <li><a href="https://www.chapman.edu/crean/" title="Crean College of Health &amp; Behavioral Sciences">Crean College of Health &amp; Behavioral Sciences</a></li>
            <li><a href="https://www.chapman.edu/dodge/" title="Dodge College of Film &amp; Media Arts">Dodge College of Film &amp; Media Arts</a></li>
            <li><a href="https://www.chapman.edu/law/" title="Fowler School of Law">Fowler School of Law</a></li>
            <li><a href="https://www.chapman.edu/scst/" title="Schmid College of Science &amp; Technology">Schmid College of Science &amp; Technology</a></li>
            <li><a href="https://www.chapman.edu/communication/" title="School of Communication">School of Communication</a></li>
            <li><a href="https://www.chapman.edu/pharmacy/" title="School of Pharmacy">School of Pharmacy</a></li>
            <li><a href="https://www.chapman.edu/wilkinson/" title="Wilkinson College of Arts, Humanities, &amp; Social Sciences">Wilkinson College of Arts, Humanities, &amp; Social Sciences</a></li>
          </ul>
        </li>
        <li>
          <a class="has-icon" href="https://events.chapman.edu/" title="Events">
            %<calendar_svg>s
            Events
          </a>
        </li>
        <li>
          <a class="has-icon" href="https://blogs.chapman.edu/" title="Blogs">
            %<newspaper_svg>s
            Blogs
          </a>
          <span class="toggle"><span>+</span></span>
          <ul>
            <li>
              <a href="https://blogs.chapman.edu/happenings/" title="Happenings">Happenings</a>
            </li>
            <li>
              <a href="https://blogs.chapman.edu/alumni/" title="Chapman Alumni">Chapman Alumni</a>
            </li>
            <li>
              <a href="https://blogs.chapman.edu/business/" title="Argyros School of Business &amp; Economics">Argyros School of Business &amp; Economics</a>
            </li>
            <li>
              <a href="https://blogs.chapman.edu/ces/" title="College of Educational Studies">College of Educational Studies</a>
            </li>
            <li>
              <a href="https://blogs.chapman.edu/copa/" title="College of Performing Arts">College of Performing Arts</a>
            </li>
            <li>
              <a href="https://blogs.chapman.edu/crean/" title="Crean College of Health and Behavioral Sciences">Crean College of Health and Behavioral Sciences</a>
            </li>
            <li>
              <a href="https://blogs.chapman.edu/dodge/" title="Dodge College of Film and Media Arts">Dodge College of Film and Media Arts</a>
            </li>
            <li>
              <a href="https://blogs.chapman.edu/law/" title="Fowler School of Law">Fowler School of Law</a>
            </li>
            <li>
              <a href="https://blogs.chapman.edu/scst/" title="Schmid College of Science and Technology">Schmid College of Science and Technology</a>
            </li>
            <li>
              <a href="https://blogs.chapman.edu/pharmacy/" title="School of Pharmacy">School of Pharmacy</a>
            </li>
            <li>
              <a href="https://blogs.chapman.edu/wilkinson/" title="Wilkinson College of Arts, Humanities, and Social Sciences">Wilkinson College of Arts, Humanities, and Social Sciences</a>
            </li>
            <li>
              <a href="https://blogs.chapman.edu/" title="View more Blogs">View More Blogs</a>
            </li>
          </ul>
        </li>
        <li>
          <a class="has-icon" href="http://inside.chapman.edu/" title="Inside Chapman">
            %<chapman_monogram_svg>s
            Inside Chapman
          </a>
        </li>
        <li>
          <a class="has-icon" href="http://social.chapman.edu/" title="Social">
            %<chat_svg>s
            Social
          </a>
        </li>
      </ul>
    </div>
OFF_CANVAS_NAV_BODY_HTML

      params = {
        chapman_window_svg: svg_tag_for_chapman_window,
        user_svg: svg_tag_for_user,
        graduation_cap_svg: svg_tag_for_graduation_cap,
        building_svg: svg_tag_for_building,
        calendar_svg: svg_tag_for_calendar,
        newspaper_svg: svg_tag_for_newspaper,
        chapman_monogram_svg: svg_tag_for_chapman_monogram,
        chat_svg: svg_tag_for_chat
      }
      format(template, params)
    end

    #
    # SVG Logos
    #
    # Paths found here:
    # https://blogs.chapman.edu/wp-content/plugins/cu-wp-customization/omni-nav/omni-nav.svg
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

    def svg_tag_for_user
      path_descriptions = [
        "M311.4,351.4c-11.1-1.8-11.3-32.2-11.3-32.2s32.5-32.2,39.6-75.4c19,0,30.8-46,11.8",
        "-62.1C352.2,164.6,375.9,48,256,48   s-96.2,116.6-95.4,133.7c-19,16.2-7.3,62.1,11",
        ".8,62.1c7.1,43.2,39.6,75.4,39.6,75.4s-0.3,30.4-11.3,32.2C165,357,32,415.7,32,480",
        "   h224h224C480,415.7,347,357,311.4,351.4z"]
      path_description = path_descriptions.join('')
      template = '<svg viewbox="0 0 512 512"><path d="%s"></path></svg>'
      format(template, path_description)
    end

    def svg_tag_for_graduation_cap
      path_descriptions = [
        "M278.1,349.9c-6,3-13.5,4.5-21,4.5c-7.5,0-15-1.5-21-4.5l-87-37.5l-31.5-13.5v60l0,",
        "0c0,1.5,0,1.5,0,3c0,42,63,78,141,78   s141-34.5,141-78v-63l-31.5,13.5L278.1,349.",
        "9z M510.5,195.5C510.5,194,510.5,194,510.5,195.5c-1.5-3-1.5-4.5-3-6l0,0   c-1.5-1",
        ".5-3-3-4.5-4.5c0,0,0,0-1.5-1.5c-1.5-1.5-3-1.5-4.5-3l0,0l0,0l0,0L264.6,80c-6-3-12",
        "-3-18,0L14.2,182c-7.5,3-13.5,12-13.5,21   s6,16.5,13.5,21l102,43.5l69,30l63,27c3",
        ",1.5,6,1.5,9,1.5c3,0,6,0,9-1.5l63-27l69-30l70.5-30v166.5c0,12,10.5,22.5,22.5,22.",
        "5   c12,0,22.5-10.5,22.5-22.5V203C512,198.5,512,197,510.5,195.5z"]
      path_description = path_descriptions.join('')
      template = '<svg viewbox="0 0 512 512"><path d="%s"></path></svg>'
      format(template, path_description)
    end

    def svg_tag_for_building
      path_descriptions = [
        "M256,0L0,160h512L256,0z M400,192l16,32v192h64V224l16-32H400z M272,192l16,32v192h",
        "64V224l16-32H272z M144,192l16,32v192   h64V224l16-32H144z M16,192l16,32v192h64V2",
        "24l16-32H16z M16,448L0,512h512l-16-64H16z M288,96c0,17.7-14.3,32-32,32s-32-14.3-",
        "32-32   s14.3-32,32-32S288,78.3,288,96z"]
      path_description = path_descriptions.join('')
      template = '<svg viewbox="0 0 512 512"><path d="%s"></path></svg>'
      format(template, path_description)
    end
    def svg_tag_for_calendar
      path_descriptions = [
        "M416,96h-32v64h-96V96h-96v64H96V96H64c-17.6,0-32,14.4-32,32v352c0,17.6,14.4,32,3",
        "2,32h352c17.6,0,32-14.4,32-32V128   C448,110.4,433.6,96,416,96z M128,480H64.1c0,",
        "0,0,0-0.1-0.1V416h64V480z M128,384H64v-64h64V384z M128,288H64v-64h64V288z M224,4",
        "80   h-64v-64h64V480z M224,384h-64v-64h64V384z M224,288h-64v-64h64V288z M320,480",
        "h-64v-64h64V480z M320,384h-64v-64h64V384z M320,288   h-64v-64h64V288z M416,479.9",
        "C416,480,416,480,416,479.9l-64,0.1v-64h64V479.9z M416,384h-64v-64h64V384z M416,2",
        "88h-64v-64h64V288z    M160,64c0-8.8-7.2-16-16-16s-16,7.2-16,16v64h32V64z M352,64",
        "c0-8.8-7.2-16-16-16s-16,7.2-16,16v64h32V64z"]
      path_description = path_descriptions.join('')
      template = '<svg viewbox="0 0 512 512"><path d="%s"></path></svg>'
      format(template, path_description)
    end
    def svg_tag_for_newspaper
      path_descriptions = [
        "M448,128V64H0v352c0,17.7,14.3,32,32,32h432c26.5,0,48-21.5,48-48V128H448z M416,41",
        "6H32V96h384V416z M64,160h320v32H64V160   z M256,224h128v32H256V224z M256,288h128",
        "v32H256V288z M256,352h96v32h-96V352z M64,224h160v160H64V224z"]
      path_description = path_descriptions.join('')
      template = '<svg viewbox="0 0 512 512"><path d="%s"></path></svg>'
      format(template, path_description)
    end
    def svg_tag_for_chapman_monogram
      path_descriptions = [
        "M423,230h89c-0.6-3.9-1.4-11.7-2.5-17.9c-5.5-31.9-16.9-60.1-33-87.4h-86.7v85.8H41",
        "9C420.7,218.3,422,226.1,423,230   L423,230z M304,210.5v-85.8H36.8c-16.1,27.3-27.",
        "5,55.9-33,87.8C1.3,226.9,0,241.4,0,256.4c0,15.1,1.3,30.3,3.8,44.6   c5.5,31.9,16",
        ".9,61.5,33,88.8h87.9v-89.7H94.2c-3.8-15.6-5.9-29.5-5.9-44.8c0-15.3,2.1-29.2,5.9-",
        "44.8H304L304,210.5z M419,300.2   H214.4v89.7h262.1c16.1-27.3,27.5-57.4,33-89.3c1",
        ".1-6.2,1.9-12.1,2.5-19.9h-89C422,288.5,420.7,292.4,419,300.2L419,300.2z    M124.",
        "7,124.8h11.7V98.9c-3.9-1.6-15.6-4.2-19.5-4.8V52.5c31.2-21,66.3-35.3,105.2-40.8v6",
        "9c-3.9,0.8-8,1.7-11.8,2.7l-7.7,2v39.4   h11.7V93.1c3.9-1,7.4-1.8,11.1-2.6l8.4-1.",
        "6V0l-11.9,1.7c-38.7,5.6-76.2,20.3-108.5,42.5l-4.3,3v55.2l7.4,1.6l8.2,2.5   C124.",
        "7,106.4,124.7,124.7,124.7,124.8L124.7,124.8z M214.4,388.7V210.5h-11.7v215.1l8.1,",
        "2c15.3,4.1,31.4,6.2,47.2,6.2   c15.8,0,31.3-2.1,46.6-6.2l7.2-2v-35.8H304v28.1c-1",
        "5.6,3.9-29.9,5.9-44.8,5.9c-14.9,0-29.2-2-44.8-5.9L214.4,388.7L214.4,388.7z    M3",
        "04,93.1v207.1h7.8V85.4l-7.7-2c-3.8-1-7.9-1.9-11.8-2.7v-69c39,5.5,74.1,19.8,105.2",
        ",40.8V94c-3.9,0.6-11.7,3.3-15.6,4.8v201.3   h7.8V106.4c3.9-1.1,8.7-2.2,10.2-2.5l",
        "9.3-1.6V47.1l-5-3C372,21.9,334.6,7.2,295.9,1.7L284.5,0v88.9l8.4,1.6   C296.6,91.",
        "3,300.1,92.1,304,93.1L304,93.1z M136.4,300.3v-89.8h-11.7v264.7l5.6,2.9C169,500.3",
        ",213.3,512,258.1,512   c44.8,0,88.4-11.7,127-33.9l4.7-2.9v-85.3H382v79.5c-39,20.",
        "7-78.2,32.6-122.8,32.6c-44.6,0-87.7-11.8-122.8-32.6   C136.4,469.4,136.4,300.3,1",
        "36.4,300.3L136.4,300.3z"]
      path_description = path_descriptions.join('')
      template = '<svg viewbox="0 0 512 512"><path d="%s"></path></svg>'
      format(template, path_description)
    end
    def svg_tag_for_chat
      path_descriptions = [
        "M213.3,28.5c117.8,0,213.3,77.3,213.3,172.6s-95.5,172.6-213.3,172.6c-11.3,0-22.4-",
        "0.7-33.3-2.1   c-45.8,45.6-98.7,53.8-151.6,55v-11.2C57,401.5,80,376.1,80,347.1c0",
        "-4-0.3-8-0.9-11.9C30.8,303.6,0,255.3,0,201.1   C0,105.8,95.5,28.5,213.3,28.5z M4",
        "42.7,415.4c0,24.9,16.1,46.6,40.9,58.6v9.6c-45.8-1-87.9-8-127.6-47.2c-9.4,1.2-19,",
        "1.8-28.8,1.8   c-42.4,0-81.5-11.4-112.7-30.7c64.3-0.2,125-20.8,171-58.1c23.2-18.",
        "8,41.5-40.8,54.4-65.5c13.7-26.2,20.6-54,20.6-82.8   c0-4.6-0.2-9.3-0.6-13.8c32.3",
        ",26.6,52.1,62.9,52.1,102.9c0,46.4-26.7,87.9-68.6,115C442.9,408.5,442.7,411.9,442",
        ".7,415.4   L442.7,415.4z"]
      path_description = path_descriptions.join('')
      template = '<svg viewbox="0 0 512 512"><path d="%s"></path></svg>'
      format(template, path_description)
    end
  end
end