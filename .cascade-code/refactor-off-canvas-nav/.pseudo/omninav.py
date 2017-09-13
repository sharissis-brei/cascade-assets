#
# Refactored OmniNav Format Pseudo-Code
#
# Based on:
# - https://dev-cascade.chapman.edu/entity/open.act?id=96e4c084c04d744c098ae2c297a66017&type=format
# - https://github.com/chapmanu/cascade-assets/issues/239#issuecomment-328168428
#

current_page_is_home_page = t/f
current_page_is_index_page = t/f

#
# OmniNav Helpers
#
macro build_off_canvas_nav_trigger():
  pass

macro build_logo():
  pass

macro build_login_component():
  pass

macro build_search_component():
  pass

macro build_off_canvas_nav():
  if current_page_is_home_page:
    build_home_page_off_canvas_nav()
  elif current_page_is_index_page:
    build_index_page_off_canvas_nav()
  else: # non-index page
    build_non_index_page_off_canvas_nav()


#
# Off-Canvas Nav Helpers
#
macro build_home_page_off_canvas_nav():
  <div class="cu-off-canvas-overlay" id="js-cu-off-canvas-overlay">
  </div>

  <div class="cu-off-canvas-nav-container open" id="js-cu-off-canvas-nav-container">
    <div class="cu-off-canvas-header">
      # X (close) button
      # Default CU icon
      # MAIN MENU
    </div>

    <div class="cu-off-canvas-nav clearfix" id="js-cu-off-canvas-nav">
      # ul of menu items (are these dynamic or static?):
      # The University +
      # Find information for... +
      # Degrees & Programs
      # Schools & Colleges +
      # Events
      # Blogs +
      # Inside Chapman
      # Social
    </div>
  </div>

macro build_index_page_off_canvas_nav():
  pass

macro build_non_index_page_off_canvas_nav():
  pass


#
# Main OmniNav markup block
#
<div id="cu_nav">

  build_off_canvas_nav_trigger()

  build_logo()

  build_login_component()

  build_search_component()

  build_off_canvas_nav()

</div>
