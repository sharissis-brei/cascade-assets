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
    # On versioning, see http://semver.org/.
    #
    VERSION = '2.0.1'.freeze
    DOMAIN = 'https://www.chapman.edu/'.freeze

    attr_accessor :target, :output_dir, :deploy_map

    #
    # Class Methods
    #

    #
    # Instance Methods
    #
    def initialize(params={})
      @target = params.fetch(:target, 'static')
      @staging_dir = Rails.root.join('build', 'omninav', 'staging')
      @output_dir = Rails.root.join('build', 'omninav', @target)

      # Set markup file name according to target. (Also validates target.)
      if @target == 'blogs'
        @markup_file = 'omni-nav.php'
      elsif @target == 'inside'
        @markup_file = 'omni-nav.html'
      elsif @target == 'static'
        @markup_file = 'omni-nav.html'
      else
        raise format('Invalid omninav target: %s', @target)
      end

      # Default deploy map. Maps file name in staging folder to name desired for output in
      # build folder. This can also be overridden in calling script.
      @deploy_map = {
        'omni-nav-*.css' => 'omni-nav.min.css',
        'omni-nav-*.js' => 'omni-nav.min.js',
        @markup_file => @markup_file
      }
    end

    def build_html
      # To make updates, see methods below for individual sections.
      sections = {
        target: @target,
        header: build_header,
        logo_html: build_logo,
        search_html: build_search,
        login_html: build_login,
        off_canvas_nav_html: build_off_canvas_nav
      }

      # rubocop:disable Rails/OutputSafety
      # App controls this string so we know it's safe. Is there better way to do this?
      format(navbar_template, sections).html_safe
      # rubocop:enable Rails/OutputSafety
    end

    def build_version
      format('%s.%s', VERSION, Time.zone.now.strftime('%Y%m%d.%H%M%S'))
    end

    def prep_build
      # Prep staging/output directories.
      [@staging_dir, @output_dir].each do |dir|
        FileUtils.rm_rf dir
        FileUtils.mkdir_p dir
      end
    end

    def generate_markup_file
      markup_file_path = @staging_dir.join(@markup_file)
      omninav_html = build_html
      File.open(markup_file_path, 'w') { |file| file.write(omninav_html) }
    end

    # rubocop:disable Rails/Output
    def move_output_files_to_build_directory
      @deploy_map.each do |staging_name, deploy_name|
        staging_file = @staging_dir.join(staging_name)
        deploy_file = @output_dir.join(deploy_name)

        if staging_file.to_s.include? '*'
          Dir.glob(staging_file).each do |path|
            FileUtils.mv path, deploy_file
            puts format('Writing %s to %s.', path, deploy_file)
          end
        else
          FileUtils.mv staging_file, deploy_file
          puts format('Writing %s to %s.', staging_file, deploy_file)
        end
      end
    end
    # rubocop:enable Rails/Output

    def cleanup
      FileUtils.rm_rf @staging_dir
    end

    private

    #
    # Markup Methods
    #
    # Note: when updating navbar markup, you will most likely be changing one of these
    # methods.
    #
    # rubocop:disable Metrics/MethodLength, Layout/IndentHeredoc
    def navbar_template
      <<-NAVBAR_HTML
%<header>s

<!-- OmniNav NavBar -->
<div id="cu_nav" class="omninav-builder use-transitions %<target>s">

%<logo_html>s
%<search_html>s
%<login_html>s
%<off_canvas_nav_html>s

</div>
<!-- End OmniNav NavBar -->

NAVBAR_HTML
    end

    def build_header
      if @target == 'blogs'
        header_for_blogs
      elsif @target == 'inside'
        header_for_inside
      else
        format('<!-- OmniNav Build Version: %s -->', build_version)
      end
    end

    def header_for_blogs
      template = <<-HEADER_PHP
<?php
// OmniNav Build Version: %<version>s

// If logged in
if (is_user_logged_in()) {

    global $current_user;
    get_currentuserinfo();
}
?>
HEADER_PHP

      params = {
        version: build_version
      }
      format(template, params)
    end

    def header_for_inside
      template = <<-HEADER_ERB
<%%
# OmniNav Build Version: %<version>s
#
# See Cascade Assets for more information.
%%>
HEADER_ERB

      params = {
        version: build_version
      }
      format(template, params)
    end

    def build_logo
      template = <<-LOGO_HTML
  <!-- Logo Block -->
  <a class="cu-logo" href="%<domain>s" title="Chapman University Website Home Page">
    %<logo>s
  </a>
LOGO_HTML

      params = {
        domain: DOMAIN,
        logo: SvgImage.chapman_horizontal_color_logo
      }
      format(template, params)
    end

    def build_search
      template = <<-SEARCH_HTML
  <!-- Search Trigger (Only displayed in mobile.) -->
  <div class="cu-search-open-trigger" id="js-cu-search-open-trigger">
    <span></span>
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
  <div id="cu_login_container" class="cu_nav_menu">
    %<identity_block>s
    %<login_form>s
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
        <a class="cu_nav_button" href="https://www.chapman.edu/panthermail">
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
        identity_block: build_identity_block,
        login_form: build_login_form,
        blackboard_svg: SvgImage.blackboard_icon,
        email_svg: SvgImage.email_icon,
        chapman_svg: SvgImage.chapman_window_icon
      }
      format(template, params)
    end

    def build_identity_block
      if @target == 'blogs'
        identity_block_for_blogs
      elsif @target == 'inside'
        identity_block_for_inside
      else
        template = <<-IDENTITY_BLOCK_HTML
    <div id="cu_identity">
      <div id="omni-login">
        %<user_svg>s
        <span class="cu_name">Log In</span>
      </div>
    </div>
IDENTITY_BLOCK_HTML

        params = {
          user_svg: SvgImage.user_icon
        }
        format(template, params)
      end
    end

    def identity_block_for_blogs
      template = <<-IDENTITY_BLOCK_PHP
    <div id="cu_identity">
        <?php if (is_user_logged_in()) : ?>
            <span class="circle-border">
              <?php echo get_avatar($current_user->user_email); ?>
            </span>
            <span class="cu_name logged-in">
              <?php echo $current_user->user_firstname; ?>
            </span>
        <?php else: ?>
            %<user_svg>s
            <span class="cu_name">Log In</span>
        <?php endif; ?>
    </div>
IDENTITY_BLOCK_PHP

      params = {
        user_svg: SvgImage.user_icon
      }
      format(template, params)
    end

    def identity_block_for_inside
      template = <<-IDENTITY_BLOCK_PHP
    <div id="cu_identity">
      <%% if current_user %%>
        <span class="circle-border">%<user_svg>s</span>
        <span class="cu_name logged-in"><%%= current_user.first_name %%></span>
      <%% else %%>
        %<user_svg>s
        <span class="cu_name">Log In</span>
      <%% end %%>
    </div>
IDENTITY_BLOCK_PHP

      params = {
        user_svg: SvgImage.user_icon
      }
      format(template, params)
    end

    def build_login_form
      if @target == 'blogs'
        login_form_for_blogs
      elsif @target == 'inside'
        login_form_for_inside
      else
        '<!-- No login form for this site -->'
      end
    end

    def login_form_for_blogs
      # TODO: Notice different wp methods used to constructs url (e.g. get_home_url vs
      # home_url). Can this be made more consistent?
      <<-LOGIN_FORM
    <?php if (is_user_logged_in()) : ?>
    <div id="cu_logged_in" class="cu_dropdown_menu">
        <?php echo get_avatar($current_user->user_email) ?>
        <p class="label">Welcome</p>
        <p class="cu_display_name boxfit"><?php echo $current_user->display_name; ?></p>
        <a href="<?php echo get_home_url( 1, 'profile', (FORCE_SSL_ADMIN) ? 'https' : 'http' ); ?>">Edit Profile</a> |
        <a href="<?php echo wp_logout_url('http://'.$_SERVER['HTTP_HOST'].$_SERVER['PHP_SELF']); ?>" id="cu_logout">Logout</a>
    </div>

    <?php else: ?>
    <div id="cu_login_form" class="cu_dropdown_menu">
      <form action="<?php echo (FORCE_SSL_LOGIN === true) ? home_url(null, 'https') : home_url(null, 'http'); ?>/wp-login.php"
            method="post">
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
    <?php endif; ?>
LOGIN_FORM
    end

    def login_form_for_inside
      <<-LOGIN_FORM
    <% if current_user %>
    <div id="cu_logged_in" class="cu_dropdown_menu">
        <p class="label">Welcome</p>
        <p class="cu_display_name boxfit"><%= "\#{current_user.first_name} \#{current_user.last_name}" %></p>
        <%= link_to "Log Out", destroy_user_session_path, method: :delete, class: 'logout' %>
    </div>

    <% else %>
    <div id="cu_login_form" class="cu_dropdown_menu">
      <%= form_for(:user, :url => new_session_path(:user)) do |f| %>
        <%= f.label :user_name, style: "display: none;"%>
        <%= f.text_field :user_name, autofocus: true, class: 'username', placeholder: 'ChapmanU User ID' %>

        <%= f.label :password, style: "display: none;" %>
        <%= f.password_field :password, class: 'password', placeholder: 'Password' %>

        <%= f.submit 'Sign in', class: 'submit-button' %>

        <%= f.check_box :remember_me %>
        <%= f.label :remember_me %>
      <% end %>
    </div>
    <% end %>
LOGIN_FORM
    end

    def build_off_canvas_nav
      template = <<-OFF_CANVAS_HTML
  <!-- Off Canvas Nav Trigger -->
  <a id="js-cu-off-canvas-nav-trigger"
     class="cu-off-canvas-nav-trigger"
     href="#"
     title="Access links to the pages within this section of the website and to other sections of the website"
     aria-label="Access links to the pages within this section of the website and to other sections of the website">
    %<hamburger_icon>s
    <span class="sr-only">Open Main Menu</span>
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
        hamburger_icon: SvgImage.hamburger_icon,
        off_canvas_header: build_off_canvas_nav_header,
        off_canvas_body: build_off_canvas_nav_body
      }
      format(template, params)
    end

    def build_off_canvas_nav_header
      # TODO: need to map output to target.
      if @target == 'cascade'
        off_canvas_nav_header_for_cascade
      else
        off_canvas_nav_header_default
      end
    end

    def build_off_canvas_nav_body
      if @target == 'cascade'
        off_canvas_nav_body_for_cascade
      else
        off_canvas_nav_body_default
      end
    end

    #
    # Off-Canvas Nav Headers
    #
    def off_canvas_nav_header_default
      template = <<-OFF_CANVAS_HEADER_HTML
    <div class="cu-off-canvas-header">
      <a class="default-logo-cu" href="#" title="Chapman University">
        %<logo>s
      </a>
      <span id="js-cu-close-off-canvas-nav" class="close">X</span>
      <div class="cu-off-canvas-links clearfix">
        <span id="js-main-menu" class="main-menu">Main Menu</span>
      </div>
    </div>
OFF_CANVAS_HEADER_HTML

      params = {
        logo: SvgImage.chapman_horizontal_color_logo
      }
      format(template, params)
    end

    def off_canvas_nav_header_for_cascade
      <<-OFF_CANVAS_HEADER_HTML
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
            <li><a href="https://www.chapman.edu/about/">About</a></li>
            <li><a href="https://www.chapman.edu/academics/">Academics</a></li>
            <li><a href="https://www.chapman.edu/admission/">Admission</a></li>
            <li><a href="https://www.chapman.edu/arts/">Arts</a></li>
            <li><a href="https://www.chapman.edu/campus-life/">Campus Life</a></li>
            <li><a href="https://www.chapman.edu/research-and-institutions/">Research</a></li>
            <li><a href="https://www.chapman.edu/support-chapman/">Support</a></li>
          </ul>
        </li>
        <li>
          <a class="has-icon" href="https://www.chapman.edu/audiences/">
            %<user_svg>s
            Find information for...
          </a>
          <span class="toggle"><span>+</span></span>
          <ul>
            <li><a href="https://www.chapman.edu/future-students/">Prospective Students</a></li>
            <li><a href="https://www.chapman.edu/students/">Current Students</a></li>
            <li><a href="https://www.chapman.edu/alumni/">Alumni</a></li>
            <li><a href="https://www.chapman.edu/faculty-staff/">Faculty &amp; Staff</a></li>
            <li><a href="https://www.chapman.edu/families/">Parents &amp; Families</a></li>
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
            <li><a href="https://www.chapman.edu/business/">Argyros School of Business &amp; Economics</a></li>
            <li><a href="https://www.chapman.edu/education/">Attallah College of Educational Studies</a></li>
            <li><a href="https://www.chapman.edu/copa/">College of Performing Arts</a></li>
            <li><a href="https://www.chapman.edu/crean/">Crean College of Health &amp; Behavioral Sciences</a></li>
            <li><a href="https://www.chapman.edu/dodge/">Dodge College of Film &amp; Media Arts</a></li>
            <li><a href="https://www.chapman.edu/law/">Fowler School of Law</a></li>
            <li><a href="https://www.chapman.edu/scst/">Schmid College of Science &amp; Technology</a></li>
            <li><a href="https://www.chapman.edu/communication/">School of Communication</a></li>
            <li><a href="https://www.chapman.edu/pharmacy/">School of Pharmacy</a></li>
            <li><a href="https://www.chapman.edu/wilkinson/">Wilkinson College of Arts, Humanities, &amp; Social Sciences</a></li>
          </ul>
        </li>
        <li>
          <a class="has-icon" href="https://events.chapman.edu/">
            %<calendar_svg>s
            Events
          </a>
        </li>
        <li>
          <a class="has-icon" href="https://blogs.chapman.edu/">
            %<newspaper_svg>s
            Blogs
          </a>
          <span class="toggle"><span>+</span></span>
          <ul>
            <li>
              <a href="https://blogs.chapman.edu/news-and-stories/" title="Blog for News and Stories">News and Stories</a>
            </li>
            <li>
              <a href="https://blogs.chapman.edu/alumni/" title="Blog for Chapman Alumni">Chapman Alumni</a>
            </li>
            <li>
              <a href="https://blogs.chapman.edu/business/" title="Blog for Argyros School of Business &amp; Economics">Argyros School of Business &amp; Economics</a>
            </li>
            <li>
              <a href="https://blogs.chapman.edu/education/" title="Blog for Attallah College of Educational Studies">Attallah College of Educational Studies</a>
            </li>
            <li>
              <a href="https://blogs.chapman.edu/copa/" title="Blog for College of Performing Arts">College of Performing Arts</a>
            </li>
            <li>
              <a href="https://blogs.chapman.edu/crean/" title="Blog for Crean College of Health and Behavioral Sciences">Crean College of Health and Behavioral Sciences</a>
            </li>
            <li>
              <a href="https://blogs.chapman.edu/dodge/" title="Blog for Dodge College of Film and Media Arts">Dodge College of Film and Media Arts</a>
            </li>
            <li>
              <a href="https://blogs.chapman.edu/law/" title="Blog for Fowler School of Law">Fowler School of Law</a>
            </li>
            <li>
              <a href="https://blogs.chapman.edu/scst/" title="Blog for Schmid College of Science and Technology">Schmid College of Science and Technology</a>
            </li>
            <li>
              <a href="https://blogs.chapman.edu/communication/" title="Blog for School of Communication">School of Communication</a>
            </li>
            <li>
              <a href="https://blogs.chapman.edu/pharmacy/" title="Blog for School of Pharmacy">School of Pharmacy</a>
            </li>
            <li>
              <a href="https://blogs.chapman.edu/wilkinson/" title="Blog for Wilkinson College of Arts, Humanities, and Social Sciences">Wilkinson College of Arts, Humanities, and Social Sciences</a>
            </li>
            <li>
              <a href="https://blogs.chapman.edu/" title="View more Blogs">View More Blogs</a>
            </li>
          </ul>
        </li>
        <li>
          <a class="has-icon" href="https://inside.chapman.edu/" title="Inside Chapman">
            %<chapman_monogram_svg>s
            Inside Chapman
          </a>
        </li>
        <li>
          <a class="has-icon" href="https://social.chapman.edu/" title="Social">
            %<chat_svg>s
            Social
          </a>
        </li>
      </ul>
    </div>
OFF_CANVAS_NAV_BODY_HTML

      params = {
        chapman_window_svg: SvgImage.chapman_window_icon,
        user_svg: SvgImage.user_icon,
        graduation_cap_svg: SvgImage.graduation_cap_icon,
        building_svg: SvgImage.building_icon,
        calendar_svg: SvgImage.calendar_icon,
        newspaper_svg: SvgImage.newspaper_icon,
        chapman_monogram_svg: SvgImage.chapman_monogram_icon,
        chat_svg: SvgImage.chat_icon
      }
      format(template, params)
    end
    # rubocop:enable Metrics/MethodLength, Layout/IndentHeredoc
  end
end
