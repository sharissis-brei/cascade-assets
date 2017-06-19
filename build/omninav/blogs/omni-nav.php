<?php
// OmniNav Build Version: 2.0.0.20170619.154221

// If logged in
if (is_user_logged_in()) {

    global $current_user;
    get_currentuserinfo();
}
?>


<!-- OmniNav NavBar -->
<div id="cu_nav" class="omninav-builder use-transitions blogs">

  <!-- Logo Block -->
  <a class="cu-logo" href="https://www.chapman.edu/" title="Chapman University Website Home Page">
    <svg xmlns="http://www.w3.org/2000/svg"
     id="chapman_logo"
     data-name="Layer 1"
     viewBox="0 0 273.58 28.08">
  <defs>
    <style>
      .cls-1 {
        fill: #98002e;
      }

      .cls-2 {
        fill: #231f20;
      }
    </style>
  </defs>
  <title>Chapman Horizontal Color</title>
  <g>
    <g>
      <polygon class="cls-1" points="13.04 14.46 0 27.49 0 14.46 13.04 14.46"/>
      <polygon class="cls-1" points="0 13.62 0 0.59 13.04 13.62 0 13.62"/>
      <polygon class="cls-1" points="27.49 0 14.46 13.03 14.46 0 27.49 0"/>
      <polygon class="cls-1" points="13.62 13.03 0.59 0 13.62 0 13.62 13.03"/>
      <polygon class="cls-1" points="15.05 13.62 28.08 0.59 28.08 13.62 15.05 13.62"/>
      <polygon class="cls-1" points="28.08 14.46 28.08 27.49 15.05 14.46 28.08 14.46"/>
      <polygon class="cls-1" points="13.62 15.05 0.59 28.08 13.62 28.08 13.62 15.05"/>
      <polygon class="cls-1" points="14.46 15.05 14.46 28.08 27.49 28.08 14.46 15.05"/>
    </g>
    <g>
      <path class="cls-2" d="M48,10.33c-0.66-2.52-2.06-3.2-4.21-3.2-3.94,0-5.7,3-5.7,6.42,0,4.23,2.17,7,5.72,7,2.45,0,3.59-1.18,4.67-3.48L49,17.16c-0.28.94-.77,2.7-1.12,3.53a19.67,19.67,0,0,1-4.12.61c-5.54,0-7.87-3.77-7.87-7.25,0-4.51,3.48-7.65,8.28-7.65A16.32,16.32,0,0,1,48.14,7c0.18,1.21.26,2.17,0.39,3.31Z"/>
      <path class="cls-2" d="M61.73,13V9.91c0-2.39-.18-2.54-1.93-2.67V6.73h5.78v0.5c-1.84.13-2,.29-2,2.67V17.8c0,2.39.18,2.54,2,2.67V21H59.63v-0.5c1.93-.13,2.1-0.29,2.1-2.67V13.9h-7.6v3.9c0,2.39.18,2.54,2,2.67V21H50.32v-0.5c1.8-.13,2-0.29,2-2.67V9.91c0-2.39-.18-2.54-2.06-2.67V6.73H56v0.5c-1.71.13-1.88,0.29-1.88,2.67V13h7.6Z"/>
      <path class="cls-2" d="M75.28,20.47l0.7-.09c0.81-.09.9-0.33,0.68-1-0.15-.53-0.79-2.23-1.4-3.81H70.81c-0.22.57-.79,2.28-1.1,3.2-0.42,1.27-.22,1.56.77,1.64l0.66,0.07V21H66.45v-0.5c1.42-.15,1.6-0.29,2.37-2.23L73.33,6.6l0.5-.2,1.56,4.16c1,2.78,2,5.57,2.85,7.8,0.7,1.84,1,2,2.34,2.1V21h-5.3v-0.5ZM71.1,14.73H75L73,9.34h0Z"/>
      <path class="cls-2" d="M85.25,17.8c0,2.39.18,2.54,2.3,2.67V21H81.44v-0.5c1.8-.13,2-0.29,2-2.67V9.91c0-2.39-.17-2.54-1.86-2.67V6.73H87.1a6,6,0,0,1,3.64.92,3.52,3.52,0,0,1,1.4,3,4.52,4.52,0,0,1-4.27,4.4,8.1,8.1,0,0,1-1,0l-1.62-.42V17.8Zm0-3.77a4.43,4.43,0,0,0,1.64.26c1.38,0,3.18-.72,3.18-3.57,0-2.39-1.25-3.35-3.51-3.35a3.48,3.48,0,0,0-1.12.11c-0.13,0-.2.15-0.2,0.59v6Z"/>
      <path class="cls-2" d="M97.53,6.73L102.83,18,108,6.73h3.62v0.5c-1.91.15-2,.24-2,2.67l0.18,7.89c0.07,2.45.13,2.52,2.06,2.67V21h-5.78v-0.5C108,20.32,108,20.25,108,17.8L107.94,9h-0.09l-5.37,11.77h-0.55L96.87,9.27h0l-0.22,6.11a27.5,27.5,0,0,0,0,3.94c0.11,0.81.64,1,2.06,1.14V21H93.52v-0.5c1.23-.11,1.69-0.33,1.84-1.14a35.15,35.15,0,0,0,.37-4.16L96,10.57c0.15-2.94,0-3.18-2.06-3.33V6.73h3.62Z"/>
      <path class="cls-2" d="M121.55,20.47l0.7-.09c0.81-.09.9-0.33,0.68-1-0.15-.53-0.79-2.23-1.4-3.81h-4.45c-0.22.57-.79,2.28-1.1,3.2-0.42,1.27-.22,1.56.77,1.64l0.66,0.07V21h-4.69v-0.5c1.42-.15,1.6-0.29,2.37-2.23L119.6,6.6l0.5-.2,1.56,4.16c1,2.78,2,5.57,2.85,7.8,0.7,1.84,1,2,2.34,2.1V21h-5.3v-0.5Zm-4.19-5.74h3.88l-1.93-5.39h0Z"/>
      <path class="cls-2" d="M140.73,21.13h-0.57L130.65,9.58h0v5.59a34.11,34.11,0,0,0,.18,4.16c0.11,0.77.7,1.07,2.15,1.14V21h-5.26v-0.5c1.2,0,1.77-.37,1.88-1.14a34,34,0,0,0,.18-4.16V10.41c0-1.58,0-1.93-.42-2.43a2.42,2.42,0,0,0-1.93-.75V6.73h3.2l9.23,11h0V12.54a33.94,33.94,0,0,0-.18-4.16c-0.11-.77-0.7-1.07-2.15-1.14V6.73h5.26v0.5c-1.21,0-1.77.37-1.88,1.14a33.94,33.94,0,0,0-.18,4.16v8.59Z"/>
      <path class="cls-2" d="M154.83,6.73v0.5c-1.75.13-1.93,0.29-1.93,2.67v4.58a7.47,7.47,0,0,0,.92,4.25A3.59,3.59,0,0,0,157,20.25a3.73,3.73,0,0,0,3.22-1.64,9.67,9.67,0,0,0,1-4.87V12.56A34.41,34.41,0,0,0,161,8.38c-0.11-.77-0.7-1.07-2.15-1.14V6.73h5.26v0.5c-1.21,0-1.77.37-1.88,1.14a34.41,34.41,0,0,0-.18,4.18V14c0,2.54-.39,4.34-1.67,5.7a6.15,6.15,0,0,1-7.65.46c-1.16-.94-1.69-2.43-1.69-4.93V9.91c0-2.39-.18-2.54-2-2.67V6.73h5.79Z"/>
      <path class="cls-2" d="M178.32,21.13h-0.57L168.24,9.58h0v5.59a34,34,0,0,0,.17,4.16c0.11,0.77.7,1.07,2.15,1.14V21h-5.26v-0.5c1.21,0,1.77-.37,1.88-1.14a34.23,34.23,0,0,0,.17-4.16V10.41c0-1.58,0-1.93-.42-2.43A2.42,2.42,0,0,0,165,7.24V6.73h3.2l9.22,11h0V12.54a34.24,34.24,0,0,0-.17-4.16c-0.11-.77-0.7-1.07-2.15-1.14V6.73h5.26v0.5c-1.21,0-1.78.37-1.88,1.14a34.22,34.22,0,0,0-.17,4.16v8.59Z"/>
      <path class="cls-2" d="M185.51,17.8c0,2.39.17,2.54,2,2.67V21H181.7v-0.5c1.8-.13,2-0.29,2-2.67V9.91c0-2.39-.17-2.54-2-2.67V6.73h5.78v0.5c-1.8.13-2,.29-2,2.67V17.8Z"/>
      <path class="cls-2" d="M195.24,21.11c-1.49-3.92-3.59-9.33-4.54-11.77-0.7-1.82-1-2-2.32-2.1V6.73h5.32v0.5l-0.7.09c-0.81.11-.94,0.33-0.7,1,0.57,1.62,2.26,5.94,3.86,10,1.14-3,3-8,3.51-9.42,0.42-1.25.2-1.53-.79-1.64l-0.66-.07V6.73H203v0.5c-1.47.15-1.66,0.31-2.48,2.24-0.29.68-3,7.19-4.65,11.63h-0.66Z"/>
      <path class="cls-2" d="M205.9,9.91c0-2.39-.17-2.54-1.93-2.67V6.73h9.6c0,0.37.13,2,.24,3.2l-0.55.07a4,4,0,0,0-.79-2c-0.35-.37-1.07-0.53-2.41-0.53h-1.67c-0.61,0-.66,0-0.66.68v5H210c1.88,0,2-.13,2.17-1.75h0.55v4.34h-0.55a2.35,2.35,0,0,0-.46-1.49,2.77,2.77,0,0,0-1.71-.28h-2.21v3.88c0,1.25.13,1.91,0.55,2.17a5,5,0,0,0,2.23.26c1.25,0,2.28-.11,2.76-0.63a6.08,6.08,0,0,0,1.05-2.15l0.55,0.07c-0.11.61-.59,2.85-0.77,3.44H203.75v-0.5c2-.13,2.15-0.29,2.15-2.67V9.91Z"/>
      <path class="cls-2" d="M220,17.8c0,2.39.17,2.54,2,2.67V21h-5.83v-0.5c1.84-.13,2-0.29,2-2.67V9.91c0-2.39-.17-2.54-1.93-2.67V6.73h5.57a6.4,6.4,0,0,1,3.46.75,3.19,3.19,0,0,1,1.45,2.8,4.09,4.09,0,0,1-2.89,3.83c0.39,0.66,1.29,2.17,2,3.13a20.17,20.17,0,0,0,1.84,2.41,2.83,2.83,0,0,0,1.64,1.1l0,0.42h-0.31c-2.52-.07-3.29-0.83-4.12-2-0.68-1-1.6-2.61-2.21-3.64a1.4,1.4,0,0,0-1.38-.79H220V17.8Zm0-3.73h1.27a3.24,3.24,0,0,0,2.19-.59,3.53,3.53,0,0,0,1.27-2.89,3.06,3.06,0,0,0-3.31-3.22,3.87,3.87,0,0,0-1.23.11c-0.13,0-.2.15-0.2,0.59v6Z"/>
      <path class="cls-2" d="M230.55,17.12c0.35,1,1.47,3.46,3.79,3.46a2.59,2.59,0,0,0,2.72-2.83c0-1.86-1.42-2.63-2.83-3.31-0.72-.35-3.68-1.38-3.68-4,0-2.17,1.64-4,4.51-4a6.44,6.44,0,0,1,1.82.29,8.55,8.55,0,0,0,.83.24c0.09,0.77.22,1.64,0.39,3l-0.55.07c-0.37-1.29-1-2.83-3-2.83a2.28,2.28,0,0,0-2.37,2.43c0,1.62,1.16,2.34,2.83,3.09,1.45,0.64,3.75,1.53,3.75,4.25,0,2.54-2.08,4.4-4.86,4.4a7,7,0,0,1-2.08-.33c-0.55-.17-0.94-0.35-1.21-0.46-0.17-.57-0.42-2.13-0.64-3.31Z"/>
      <path class="cls-2" d="M244.28,17.8c0,2.39.17,2.54,2,2.67V21h-5.78v-0.5c1.8-.13,2-0.29,2-2.67V9.91c0-2.39-.17-2.54-2-2.67V6.73h5.78v0.5c-1.8.13-2,.29-2,2.67V17.8Z"/>
      <path class="cls-2" d="M254.73,17.8c0,2.39.18,2.54,2.32,2.67V21h-6.4v-0.5c2.06-.13,2.24-0.29,2.24-2.67V7.46h-1c-2,0-2.54.29-2.87,0.7a5.81,5.81,0,0,0-.77,1.88h-0.55c0.09-1.34.22-2.74,0.26-3.86h0.31a1,1,0,0,0,1.14.55h9a1.05,1.05,0,0,0,1-.55h0.31c0,0.92.13,2.52,0.24,3.79L259.4,10a4.26,4.26,0,0,0-.79-2c-0.37-.42-1.05-0.57-2.41-0.57h-1.47V17.8Z"/>
      <path class="cls-2" d="M267.95,17.8c0,2.39.17,2.54,2.28,2.67V21h-6.31v-0.5c2-.13,2.19-0.29,2.19-2.67V15.3a2.27,2.27,0,0,0-.48-1.31c-1-1.71-1.84-3.29-2.78-4.91s-1-1.69-2.3-1.84V6.73h5.28v0.5l-1,.13c-0.55.09-.7,0.28-0.33,1,1,1.84,2,3.66,3.07,5.46,0.92-1.75,1.91-3.55,2.72-5.35,0.37-.79.2-1-0.63-1.1l-0.88-.11V6.73h4.82v0.5c-1.47.13-1.58,0.42-2.5,1.86s-1.82,3-2.76,4.8a1.89,1.89,0,0,0-.37,1.18V17.8Z"/>
    </g>
  </g>
</svg>

  </a>

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
      <form action="https://www.chapman.edu/search-results/index.aspx">
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
                <input class="gsc-search-button" type="button" value="Search" />
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

  <div id="cu_login_container" class="cu_nav_menu">
        <div id="cu_identity">
        <?php if (is_user_logged_in()) : ?>
            <span class="circle-border">
              <?php echo get_avatar($current_user->user_email); ?>
            </span>
            <span class="cu_name logged-in">
              <?php echo $current_user->user_firstname; ?>
            </span>
        <?php else: ?>
            <svg class="user svg-icon" viewbox="0 0 16 16"><path d="M4 5c0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.209-1.791 4-4 4s-4-1.791-4-4zM12 10h-8c-2.209 0-4 1.791-4 4v1h16v-1c0-2.209-1.791-4-4-4z"></path></svg>
            <span class="cu_name">Log In</span>
        <?php endif; ?>
    </div>

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

    <ul class="cu_dropdown_menu">
      <li>
        <a class="cu_nav_button" href="https://blackboard.chapman.edu/">
          <svg class="blackboard svg-icon" viewbox="0 0 512 512"><path d="M321.908,138.085c-1.745-32.661-28.423-11.469-29.42-27.924c-0.499-11.469,20.943-5.983,61.832-34.406c3.241-1.745,4.736-3.491,7.978-3.74c4.986-0.249,3.74,9.724,3.99,12.965l9.723,177.766c16.954-17.203,35.902-32.909,58.591-34.156c52.108-2.742,74.298,41.637,75.794,72.802c3.739,68.563-33.41,106.46-88.759,109.452c-40.64,2.244-54.851-14.96-61.333-14.711c-8.228,0.499-11.968,18.7-21.94,19.198c-3.241,0.249-4.986-1.246-5.235-4.737c-0.25-3.241,2.493-13.214,1.246-36.151L321.908,138.085L321.908,138.085z M380.748,350.756c1.994,37.398,36.65,43.881,49.864,43.133c37.398-1.994,43.631-38.396,42.136-67.566c-1.745-34.156-19.946-65.82-62.331-63.577c-12.964,0.749-33.658,9.973-32.91,26.429L380.748,350.756L380.748,350.756z"></path><path d="M50.397,174.237c-3.241-62.081-49.365-34.905-50.363-56.097c-0.499-8.228,4.488-6.731,7.729-6.981c1.745,0,4.986,1.247,26.179,0.25c39.143-2.244,76.542-5.735,113.939-7.729c110.949-5.984,114.439,60.834,114.937,70.558c1.496,29.42-13.463,54.601-45.376,66.319v1.745c56.097,9.973,73.798,33.658,76.042,74.298c3.242,60.336-35.403,99.978-108.704,103.966c-66.818,3.74-89.755,3.241-112.444,4.488c-11.469,0.498-22.688,2.992-32.412,3.491c-9.724,0.498-14.71,0.747-14.959-5.735c-0.748-14.709,38.895-5.485,36.65-49.365L50.397,174.237L50.397,174.237z M108.49,220.112c1.246,21.191,6.233,24.184,32.412,24.434l26.179-1.496c34.157-1.747,46.374-20.444,44.628-53.106c-2.493-42.384-36.65-68.313-77.29-66.07c-29.42,1.496-30.168,17.951-28.672,44.13L108.49,220.112L108.49,220.112zM115.471,350.507c2.244,42.384,14.46,54.851,58.341,52.357c44.13-2.493,65.322-32.91,62.829-77.04c-1.496-26.179-16.705-66.07-98.232-61.582c-26.179,1.495-27.176,12.965-25.93,35.651L115.471,350.507L115.471,350.507z"></svg>
          Blackboard
        </a>
      </li>
      <li>
        <a class="cu_nav_button" href="https://my.chapman.edu/">
          <svg class="chapman_window svg-icon" viewbox="0 0 512 512"><path d="M237.543,263.319L-0.266,501.073V263.319H237.543z M-0.266,248.073V10.26l237.81,237.813H-0.266zM501.276-0.455L263.518,237.291V-0.455H501.276z M248.299,237.291L10.507-0.455h237.792V237.291z M274.291,248.073L512.032,10.26v237.813H274.291z M512.032,263.319v237.754L274.291,263.319H512.032z M248.299,274.025L10.507,511.831h237.792V274.025zM263.518,274.025v237.806h237.725L263.518,274.025z"></path></svg>
          MyChapman
        </a>
      </li>
      <li>
        <a class="cu_nav_button" href="https://exchange.chapman.edu/">
          <svg class="email svg-icon" viewbox="0 0 512 512"><path d="M480,64H32C14.4,64,0,78.4,0,96v320c0,17.6,14.399,32,32,32h448c17.6,0,32-14.4,32-32V96C512,78.4,497.6,64,480,64zM448,128v23L256,264.143L64,151v-23H448z M64,384V206.714l192,113.144l192-113.144V384H64z"></path></svg>
          Staff &amp; Faculty Email
        </a>
      </li>
      <li>
        <a class="cu_nav_button" href="https://www.chapman.edu/panthermail">
          <svg class="email svg-icon" viewbox="0 0 512 512"><path d="M480,64H32C14.4,64,0,78.4,0,96v320c0,17.6,14.399,32,32,32h448c17.6,0,32-14.4,32-32V96C512,78.4,497.6,64,480,64zM448,128v23L256,264.143L64,151v-23H448z M64,384V206.714l192,113.144l192-113.144V384H64z"></path></svg>
          PantherMail
        </a>
      </li>
      <li>
        <a class="cu_nav_button" href="https://mywindow.chapman.edu/">
          <svg class="chapman_window svg-icon" viewbox="0 0 512 512"><path d="M237.543,263.319L-0.266,501.073V263.319H237.543z M-0.266,248.073V10.26l237.81,237.813H-0.266zM501.276-0.455L263.518,237.291V-0.455H501.276z M248.299,237.291L10.507-0.455h237.792V237.291z M274.291,248.073L512.032,10.26v237.813H274.291z M512.032,263.319v237.754L274.291,263.319H512.032z M248.299,274.025L10.507,511.831h237.792V274.025zM263.518,274.025v237.806h237.725L263.518,274.025z"></path></svg>
          MyWindow
        </a>
      </li>
    </ul>
  </div>

  <!-- Off Canvas Nav Trigger -->
  <a id="js-cu-off-canvas-nav-trigger"
     class="cu-off-canvas-nav-trigger"
     href="#"
     title="Access links to the pages within this section of the website and to other sections of the website"
     aria-label="Access links to the pages within this section of the website and to other sections of the website">
    <svg class="hamburger svg-icon" viewbox="0 0 16 16"><path d="M1 3h14v2h-14v-2z"></path><path d="M1 7h14v2h-14v-2z"></path><path d="M1 11h14v2h-14v-2z"></path></svg>
    <span class="sr-only">Open Main Menu</span>
  </a>

  <!-- Off Canvas Nav -->
  <div class="cu-off-canvas-overlay" id="js-cu-off-canvas-overlay"></div>

  <div class="cu-off-canvas-nav-container" id="js-cu-off-canvas-nav-container">
        <div class="cu-off-canvas-header">
      <a class="default-logo-cu" href="#" title="Chapman University">
        <svg xmlns="http://www.w3.org/2000/svg"
     id="chapman_logo"
     data-name="Layer 1"
     viewBox="0 0 273.58 28.08">
  <defs>
    <style>
      .cls-1 {
        fill: #98002e;
      }

      .cls-2 {
        fill: #231f20;
      }
    </style>
  </defs>
  <title>Chapman Horizontal Color</title>
  <g>
    <g>
      <polygon class="cls-1" points="13.04 14.46 0 27.49 0 14.46 13.04 14.46"/>
      <polygon class="cls-1" points="0 13.62 0 0.59 13.04 13.62 0 13.62"/>
      <polygon class="cls-1" points="27.49 0 14.46 13.03 14.46 0 27.49 0"/>
      <polygon class="cls-1" points="13.62 13.03 0.59 0 13.62 0 13.62 13.03"/>
      <polygon class="cls-1" points="15.05 13.62 28.08 0.59 28.08 13.62 15.05 13.62"/>
      <polygon class="cls-1" points="28.08 14.46 28.08 27.49 15.05 14.46 28.08 14.46"/>
      <polygon class="cls-1" points="13.62 15.05 0.59 28.08 13.62 28.08 13.62 15.05"/>
      <polygon class="cls-1" points="14.46 15.05 14.46 28.08 27.49 28.08 14.46 15.05"/>
    </g>
    <g>
      <path class="cls-2" d="M48,10.33c-0.66-2.52-2.06-3.2-4.21-3.2-3.94,0-5.7,3-5.7,6.42,0,4.23,2.17,7,5.72,7,2.45,0,3.59-1.18,4.67-3.48L49,17.16c-0.28.94-.77,2.7-1.12,3.53a19.67,19.67,0,0,1-4.12.61c-5.54,0-7.87-3.77-7.87-7.25,0-4.51,3.48-7.65,8.28-7.65A16.32,16.32,0,0,1,48.14,7c0.18,1.21.26,2.17,0.39,3.31Z"/>
      <path class="cls-2" d="M61.73,13V9.91c0-2.39-.18-2.54-1.93-2.67V6.73h5.78v0.5c-1.84.13-2,.29-2,2.67V17.8c0,2.39.18,2.54,2,2.67V21H59.63v-0.5c1.93-.13,2.1-0.29,2.1-2.67V13.9h-7.6v3.9c0,2.39.18,2.54,2,2.67V21H50.32v-0.5c1.8-.13,2-0.29,2-2.67V9.91c0-2.39-.18-2.54-2.06-2.67V6.73H56v0.5c-1.71.13-1.88,0.29-1.88,2.67V13h7.6Z"/>
      <path class="cls-2" d="M75.28,20.47l0.7-.09c0.81-.09.9-0.33,0.68-1-0.15-.53-0.79-2.23-1.4-3.81H70.81c-0.22.57-.79,2.28-1.1,3.2-0.42,1.27-.22,1.56.77,1.64l0.66,0.07V21H66.45v-0.5c1.42-.15,1.6-0.29,2.37-2.23L73.33,6.6l0.5-.2,1.56,4.16c1,2.78,2,5.57,2.85,7.8,0.7,1.84,1,2,2.34,2.1V21h-5.3v-0.5ZM71.1,14.73H75L73,9.34h0Z"/>
      <path class="cls-2" d="M85.25,17.8c0,2.39.18,2.54,2.3,2.67V21H81.44v-0.5c1.8-.13,2-0.29,2-2.67V9.91c0-2.39-.17-2.54-1.86-2.67V6.73H87.1a6,6,0,0,1,3.64.92,3.52,3.52,0,0,1,1.4,3,4.52,4.52,0,0,1-4.27,4.4,8.1,8.1,0,0,1-1,0l-1.62-.42V17.8Zm0-3.77a4.43,4.43,0,0,0,1.64.26c1.38,0,3.18-.72,3.18-3.57,0-2.39-1.25-3.35-3.51-3.35a3.48,3.48,0,0,0-1.12.11c-0.13,0-.2.15-0.2,0.59v6Z"/>
      <path class="cls-2" d="M97.53,6.73L102.83,18,108,6.73h3.62v0.5c-1.91.15-2,.24-2,2.67l0.18,7.89c0.07,2.45.13,2.52,2.06,2.67V21h-5.78v-0.5C108,20.32,108,20.25,108,17.8L107.94,9h-0.09l-5.37,11.77h-0.55L96.87,9.27h0l-0.22,6.11a27.5,27.5,0,0,0,0,3.94c0.11,0.81.64,1,2.06,1.14V21H93.52v-0.5c1.23-.11,1.69-0.33,1.84-1.14a35.15,35.15,0,0,0,.37-4.16L96,10.57c0.15-2.94,0-3.18-2.06-3.33V6.73h3.62Z"/>
      <path class="cls-2" d="M121.55,20.47l0.7-.09c0.81-.09.9-0.33,0.68-1-0.15-.53-0.79-2.23-1.4-3.81h-4.45c-0.22.57-.79,2.28-1.1,3.2-0.42,1.27-.22,1.56.77,1.64l0.66,0.07V21h-4.69v-0.5c1.42-.15,1.6-0.29,2.37-2.23L119.6,6.6l0.5-.2,1.56,4.16c1,2.78,2,5.57,2.85,7.8,0.7,1.84,1,2,2.34,2.1V21h-5.3v-0.5Zm-4.19-5.74h3.88l-1.93-5.39h0Z"/>
      <path class="cls-2" d="M140.73,21.13h-0.57L130.65,9.58h0v5.59a34.11,34.11,0,0,0,.18,4.16c0.11,0.77.7,1.07,2.15,1.14V21h-5.26v-0.5c1.2,0,1.77-.37,1.88-1.14a34,34,0,0,0,.18-4.16V10.41c0-1.58,0-1.93-.42-2.43a2.42,2.42,0,0,0-1.93-.75V6.73h3.2l9.23,11h0V12.54a33.94,33.94,0,0,0-.18-4.16c-0.11-.77-0.7-1.07-2.15-1.14V6.73h5.26v0.5c-1.21,0-1.77.37-1.88,1.14a33.94,33.94,0,0,0-.18,4.16v8.59Z"/>
      <path class="cls-2" d="M154.83,6.73v0.5c-1.75.13-1.93,0.29-1.93,2.67v4.58a7.47,7.47,0,0,0,.92,4.25A3.59,3.59,0,0,0,157,20.25a3.73,3.73,0,0,0,3.22-1.64,9.67,9.67,0,0,0,1-4.87V12.56A34.41,34.41,0,0,0,161,8.38c-0.11-.77-0.7-1.07-2.15-1.14V6.73h5.26v0.5c-1.21,0-1.77.37-1.88,1.14a34.41,34.41,0,0,0-.18,4.18V14c0,2.54-.39,4.34-1.67,5.7a6.15,6.15,0,0,1-7.65.46c-1.16-.94-1.69-2.43-1.69-4.93V9.91c0-2.39-.18-2.54-2-2.67V6.73h5.79Z"/>
      <path class="cls-2" d="M178.32,21.13h-0.57L168.24,9.58h0v5.59a34,34,0,0,0,.17,4.16c0.11,0.77.7,1.07,2.15,1.14V21h-5.26v-0.5c1.21,0,1.77-.37,1.88-1.14a34.23,34.23,0,0,0,.17-4.16V10.41c0-1.58,0-1.93-.42-2.43A2.42,2.42,0,0,0,165,7.24V6.73h3.2l9.22,11h0V12.54a34.24,34.24,0,0,0-.17-4.16c-0.11-.77-0.7-1.07-2.15-1.14V6.73h5.26v0.5c-1.21,0-1.78.37-1.88,1.14a34.22,34.22,0,0,0-.17,4.16v8.59Z"/>
      <path class="cls-2" d="M185.51,17.8c0,2.39.17,2.54,2,2.67V21H181.7v-0.5c1.8-.13,2-0.29,2-2.67V9.91c0-2.39-.17-2.54-2-2.67V6.73h5.78v0.5c-1.8.13-2,.29-2,2.67V17.8Z"/>
      <path class="cls-2" d="M195.24,21.11c-1.49-3.92-3.59-9.33-4.54-11.77-0.7-1.82-1-2-2.32-2.1V6.73h5.32v0.5l-0.7.09c-0.81.11-.94,0.33-0.7,1,0.57,1.62,2.26,5.94,3.86,10,1.14-3,3-8,3.51-9.42,0.42-1.25.2-1.53-.79-1.64l-0.66-.07V6.73H203v0.5c-1.47.15-1.66,0.31-2.48,2.24-0.29.68-3,7.19-4.65,11.63h-0.66Z"/>
      <path class="cls-2" d="M205.9,9.91c0-2.39-.17-2.54-1.93-2.67V6.73h9.6c0,0.37.13,2,.24,3.2l-0.55.07a4,4,0,0,0-.79-2c-0.35-.37-1.07-0.53-2.41-0.53h-1.67c-0.61,0-.66,0-0.66.68v5H210c1.88,0,2-.13,2.17-1.75h0.55v4.34h-0.55a2.35,2.35,0,0,0-.46-1.49,2.77,2.77,0,0,0-1.71-.28h-2.21v3.88c0,1.25.13,1.91,0.55,2.17a5,5,0,0,0,2.23.26c1.25,0,2.28-.11,2.76-0.63a6.08,6.08,0,0,0,1.05-2.15l0.55,0.07c-0.11.61-.59,2.85-0.77,3.44H203.75v-0.5c2-.13,2.15-0.29,2.15-2.67V9.91Z"/>
      <path class="cls-2" d="M220,17.8c0,2.39.17,2.54,2,2.67V21h-5.83v-0.5c1.84-.13,2-0.29,2-2.67V9.91c0-2.39-.17-2.54-1.93-2.67V6.73h5.57a6.4,6.4,0,0,1,3.46.75,3.19,3.19,0,0,1,1.45,2.8,4.09,4.09,0,0,1-2.89,3.83c0.39,0.66,1.29,2.17,2,3.13a20.17,20.17,0,0,0,1.84,2.41,2.83,2.83,0,0,0,1.64,1.1l0,0.42h-0.31c-2.52-.07-3.29-0.83-4.12-2-0.68-1-1.6-2.61-2.21-3.64a1.4,1.4,0,0,0-1.38-.79H220V17.8Zm0-3.73h1.27a3.24,3.24,0,0,0,2.19-.59,3.53,3.53,0,0,0,1.27-2.89,3.06,3.06,0,0,0-3.31-3.22,3.87,3.87,0,0,0-1.23.11c-0.13,0-.2.15-0.2,0.59v6Z"/>
      <path class="cls-2" d="M230.55,17.12c0.35,1,1.47,3.46,3.79,3.46a2.59,2.59,0,0,0,2.72-2.83c0-1.86-1.42-2.63-2.83-3.31-0.72-.35-3.68-1.38-3.68-4,0-2.17,1.64-4,4.51-4a6.44,6.44,0,0,1,1.82.29,8.55,8.55,0,0,0,.83.24c0.09,0.77.22,1.64,0.39,3l-0.55.07c-0.37-1.29-1-2.83-3-2.83a2.28,2.28,0,0,0-2.37,2.43c0,1.62,1.16,2.34,2.83,3.09,1.45,0.64,3.75,1.53,3.75,4.25,0,2.54-2.08,4.4-4.86,4.4a7,7,0,0,1-2.08-.33c-0.55-.17-0.94-0.35-1.21-0.46-0.17-.57-0.42-2.13-0.64-3.31Z"/>
      <path class="cls-2" d="M244.28,17.8c0,2.39.17,2.54,2,2.67V21h-5.78v-0.5c1.8-.13,2-0.29,2-2.67V9.91c0-2.39-.17-2.54-2-2.67V6.73h5.78v0.5c-1.8.13-2,.29-2,2.67V17.8Z"/>
      <path class="cls-2" d="M254.73,17.8c0,2.39.18,2.54,2.32,2.67V21h-6.4v-0.5c2.06-.13,2.24-0.29,2.24-2.67V7.46h-1c-2,0-2.54.29-2.87,0.7a5.81,5.81,0,0,0-.77,1.88h-0.55c0.09-1.34.22-2.74,0.26-3.86h0.31a1,1,0,0,0,1.14.55h9a1.05,1.05,0,0,0,1-.55h0.31c0,0.92.13,2.52,0.24,3.79L259.4,10a4.26,4.26,0,0,0-.79-2c-0.37-.42-1.05-0.57-2.41-0.57h-1.47V17.8Z"/>
      <path class="cls-2" d="M267.95,17.8c0,2.39.17,2.54,2.28,2.67V21h-6.31v-0.5c2-.13,2.19-0.29,2.19-2.67V15.3a2.27,2.27,0,0,0-.48-1.31c-1-1.71-1.84-3.29-2.78-4.91s-1-1.69-2.3-1.84V6.73h5.28v0.5l-1,.13c-0.55.09-.7,0.28-0.33,1,1,1.84,2,3.66,3.07,5.46,0.92-1.75,1.91-3.55,2.72-5.35,0.37-.79.2-1-0.63-1.1l-0.88-.11V6.73h4.82v0.5c-1.47.13-1.58,0.42-2.5,1.86s-1.82,3-2.76,4.8a1.89,1.89,0,0,0-.37,1.18V17.8Z"/>
    </g>
  </g>
</svg>

      </a>
      <span id="js-cu-close-off-canvas-nav" class="close">X</span>
      <div class="cu-off-canvas-links clearfix">
        <span id="js-main-menu" class="main-menu">Main Menu</span>
      </div>
    </div>

        <div class="cu-off-canvas-nav clearfix" id="js-cu-off-canvas-nav">
      <ul class="level-1">
        <li>
          <a class="has-icon" href="https://www.chapman.edu/" title="The University">
            <svg class="chapman_window svg-icon" viewbox="0 0 512 512"><path d="M237.543,263.319L-0.266,501.073V263.319H237.543z M-0.266,248.073V10.26l237.81,237.813H-0.266zM501.276-0.455L263.518,237.291V-0.455H501.276z M248.299,237.291L10.507-0.455h237.792V237.291z M274.291,248.073L512.032,10.26v237.813H274.291z M512.032,263.319v237.754L274.291,263.319H512.032z M248.299,274.025L10.507,511.831h237.792V274.025zM263.518,274.025v237.806h237.725L263.518,274.025z"></path></svg>
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
            <svg class="user svg-icon" viewbox="0 0 16 16"><path d="M4 5c0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.209-1.791 4-4 4s-4-1.791-4-4zM12 10h-8c-2.209 0-4 1.791-4 4v1h16v-1c0-2.209-1.791-4-4-4z"></path></svg>
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
            <svg class="graduation-cap svg-icon" viewbox="0 0 512 512"><path d="M278.1,349.9c-6,3-13.5,4.5-21,4.5c-7.5,0-15-1.5-21-4.5l-87-37.5l-31.5-13.5v60l0,0c0,1.5,0,1.5,0,3c0,42,63,78,141,78   s141-34.5,141-78v-63l-31.5,13.5L278.1,349.9z M510.5,195.5C510.5,194,510.5,194,510.5,195.5c-1.5-3-1.5-4.5-3-6l0,0   c-1.5-1.5-3-3-4.5-4.5c0,0,0,0-1.5-1.5c-1.5-1.5-3-1.5-4.5-3l0,0l0,0l0,0L264.6,80c-6-3-12-3-18,0L14.2,182c-7.5,3-13.5,12-13.5,21   s6,16.5,13.5,21l102,43.5l69,30l63,27c3,1.5,6,1.5,9,1.5c3,0,6,0,9-1.5l63-27l69-30l70.5-30v166.5c0,12,10.5,22.5,22.5,22.5   c12,0,22.5-10.5,22.5-22.5V203C512,198.5,512,197,510.5,195.5z"></path></svg>
            Degrees &amp; Programs
          </a>
        </li>
        <li>
          <a class="has-icon" href="https://www.chapman.edu/academics/schools-colleges.aspx" title="Schools &amp; Colleges">
            <svg class="building svg-icon" viewbox="0 0 512 512"><path d="M256,0L0,160h512L256,0z M400,192l16,32v192h64V224l16-32H400z M272,192l16,32v192h64V224l16-32H272z M144,192l16,32v192   h64V224l16-32H144z M16,192l16,32v192h64V224l16-32H16z M16,448L0,512h512l-16-64H16z M288,96c0,17.7-14.3,32-32,32s-32-14.3-32-32   s14.3-32,32-32S288,78.3,288,96z"></path></svg>
            Schools &amp; Colleges
          </a>
          <span class="toggle"><span>+</span></span>
          <ul>
            <li><a href="https://www.chapman.edu/business/">Argyros School of Business &amp; Economics</a></li>
            <li><a href="https://www.chapman.edu/ces/">College of Educational Studies</a></li>
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
            <svg class="calendar svg-icon" viewbox="0 0 512 512"><path d="M416,96h-32v64h-96V96h-96v64H96V96H64c-17.6,0-32,14.4-32,32v352c0,17.6,14.4,32,32,32h352c17.6,0,32-14.4,32-32V128   C448,110.4,433.6,96,416,96z M128,480H64.1c0,0,0,0-0.1-0.1V416h64V480z M128,384H64v-64h64V384z M128,288H64v-64h64V288z M224,480   h-64v-64h64V480z M224,384h-64v-64h64V384z M224,288h-64v-64h64V288z M320,480h-64v-64h64V480z M320,384h-64v-64h64V384z M320,288   h-64v-64h64V288z M416,479.9C416,480,416,480,416,479.9l-64,0.1v-64h64V479.9z M416,384h-64v-64h64V384z M416,288h-64v-64h64V288z    M160,64c0-8.8-7.2-16-16-16s-16,7.2-16,16v64h32V64z M352,64c0-8.8-7.2-16-16-16s-16,7.2-16,16v64h32V64z"></path></svg>
            Events
          </a>
        </li>
        <li>
          <a class="has-icon" href="https://blogs.chapman.edu/">
            <svg class="newspaper svg-icon" viewbox="0 0 512 512"><path d="M448,128V64H0v352c0,17.7,14.3,32,32,32h432c26.5,0,48-21.5,48-48V128H448z M416,416H32V96h384V416z M64,160h320v32H64V160   z M256,224h128v32H256V224z M256,288h128v32H256V288z M256,352h96v32h-96V352z M64,224h160v160H64V224z"></path></svg>
            Blogs
          </a>
          <span class="toggle"><span>+</span></span>
          <ul>
            <li>
              <a href="https://blogs.chapman.edu/happenings/" title="Blog for Happenings">Happenings</a>
            </li>
            <li>
              <a href="https://blogs.chapman.edu/alumni/" title="Blog for Chapman Alumni">Chapman Alumni</a>
            </li>
            <li>
              <a href="https://blogs.chapman.edu/business/" title="Blog for Argyros School of Business &amp; Economics">Argyros School of Business &amp; Economics</a>
            </li>
            <li>
              <a href="https://blogs.chapman.edu/ces/" title="Blog for College of Educational Studies">College of Educational Studies</a>
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
            <svg class="chapman_monogram svg-icon" viewbox="0 0 512 512"><path d="M423,230h89c-0.6-3.9-1.4-11.7-2.5-17.9c-5.5-31.9-16.9-60.1-33-87.4h-86.7v85.8H419C420.7,218.3,422,226.1,423,230   L423,230z M304,210.5v-85.8H36.8c-16.1,27.3-27.5,55.9-33,87.8C1.3,226.9,0,241.4,0,256.4c0,15.1,1.3,30.3,3.8,44.6   c5.5,31.9,16.9,61.5,33,88.8h87.9v-89.7H94.2c-3.8-15.6-5.9-29.5-5.9-44.8c0-15.3,2.1-29.2,5.9-44.8H304L304,210.5z M419,300.2   H214.4v89.7h262.1c16.1-27.3,27.5-57.4,33-89.3c1.1-6.2,1.9-12.1,2.5-19.9h-89C422,288.5,420.7,292.4,419,300.2L419,300.2z    M124.7,124.8h11.7V98.9c-3.9-1.6-15.6-4.2-19.5-4.8V52.5c31.2-21,66.3-35.3,105.2-40.8v69c-3.9,0.8-8,1.7-11.8,2.7l-7.7,2v39.4   h11.7V93.1c3.9-1,7.4-1.8,11.1-2.6l8.4-1.6V0l-11.9,1.7c-38.7,5.6-76.2,20.3-108.5,42.5l-4.3,3v55.2l7.4,1.6l8.2,2.5   C124.7,106.4,124.7,124.7,124.7,124.8L124.7,124.8z M214.4,388.7V210.5h-11.7v215.1l8.1,2c15.3,4.1,31.4,6.2,47.2,6.2   c15.8,0,31.3-2.1,46.6-6.2l7.2-2v-35.8H304v28.1c-15.6,3.9-29.9,5.9-44.8,5.9c-14.9,0-29.2-2-44.8-5.9L214.4,388.7L214.4,388.7z    M304,93.1v207.1h7.8V85.4l-7.7-2c-3.8-1-7.9-1.9-11.8-2.7v-69c39,5.5,74.1,19.8,105.2,40.8V94c-3.9,0.6-11.7,3.3-15.6,4.8v201.3   h7.8V106.4c3.9-1.1,8.7-2.2,10.2-2.5l9.3-1.6V47.1l-5-3C372,21.9,334.6,7.2,295.9,1.7L284.5,0v88.9l8.4,1.6   C296.6,91.3,300.1,92.1,304,93.1L304,93.1z M136.4,300.3v-89.8h-11.7v264.7l5.6,2.9C169,500.3,213.3,512,258.1,512   c44.8,0,88.4-11.7,127-33.9l4.7-2.9v-85.3H382v79.5c-39,20.7-78.2,32.6-122.8,32.6c-44.6,0-87.7-11.8-122.8-32.6   C136.4,469.4,136.4,300.3,136.4,300.3L136.4,300.3z"></path></svg>
            Inside Chapman
          </a>
        </li>
        <li>
          <a class="has-icon" href="https://social.chapman.edu/" title="Social">
            <svg class="chat svg-icon" viewbox="0 0 512 512"><path d="M213.3,28.5c117.8,0,213.3,77.3,213.3,172.6s-95.5,172.6-213.3,172.6c-11.3,0-22.4-0.7-33.3-2.1   c-45.8,45.6-98.7,53.8-151.6,55v-11.2C57,401.5,80,376.1,80,347.1c0-4-0.3-8-0.9-11.9C30.8,303.6,0,255.3,0,201.1   C0,105.8,95.5,28.5,213.3,28.5z M442.7,415.4c0,24.9,16.1,46.6,40.9,58.6v9.6c-45.8-1-87.9-8-127.6-47.2c-9.4,1.2-19,1.8-28.8,1.8   c-42.4,0-81.5-11.4-112.7-30.7c64.3-0.2,125-20.8,171-58.1c23.2-18.8,41.5-40.8,54.4-65.5c13.7-26.2,20.6-54,20.6-82.8   c0-4.6-0.2-9.3-0.6-13.8c32.3,26.6,52.1,62.9,52.1,102.9c0,46.4-26.7,87.9-68.6,115C442.9,408.5,442.7,411.9,442.7,415.4   L442.7,415.4z"></path></svg>
            Social
          </a>
        </li>
      </ul>
    </div>

  </div>
  <!-- End Off Canvas Nav -->



</div>
<!-- End OmniNav NavBar -->

