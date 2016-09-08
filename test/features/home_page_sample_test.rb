#
# Feature Tests for Sample Home Page
#
# To run individually:
#   rake test test/features/home_page_sample_test.rb
#
require "test_helper"

feature "Sample home page" do
  scenario "user visits home page" do
    # Arrange
    endpoint = '/home_page/sample'
    omninav_selector = 'div#cu_nav'

    # Act
    visit endpoint

    # Assert
    assert page.has_selector?(omninav_selector, visible: :visible)
  end

  scenario "user opens and closes side nav menu using hamburger icon" do
    # TODO(tatwell): I couldn't figure out a way to actually run this test as wanted. The problem
    # is asserting elements are in expected state (visible on screen or not). AFAICT, the
    # elements are never not displayed. The position of the menu is simply adjusted from left of
    # viewport into viewport. So the has_selector? visible option can not be used.
    #
    # The menu class changes when icon is clicked. But I couldn't get Capybara to acknowledge
    # change in class. It doesn't seem to wait for transition.
    #
    # Is the javascript even being exercised in this test? It would be nice to get this test
    # working as expected as a way to verify javascript is at least functional before deploy.
    # Arrange
    hamburger_icon_selector = 'a#js-cu-off-canvas-nav-trigger'
    side_nav_menu_selector = 'div#js-cu-off-canvas-nav-container'
    side_nav_menu_open_selector = 'div#js-cu-off-canvas-nav-container.open'
    close_icon_selector = 'span#js-cu-close-off-canvas-nav'

    visit "/home_page/sample"

    # Open hamburger menu.
    # Assume
    assert page.has_selector?(hamburger_icon_selector)
    assert page.has_selector?(side_nav_menu_selector)
    assert !page.has_selector?(side_nav_menu_open_selector)
    assert page.has_selector?(close_icon_selector)

    # Act
    page.find(hamburger_icon_selector).click

    # Assert
    # TODO: figure out a way to test menu now open. This does not work. Test completes in less
    # than .1 second so Capybara is not waiting as expected.
    # assert page.has_selector?(side_nav_menu_open_selector)

    # Close hamburger menu.
    # Act
    find(close_icon_selector).click

    # Assert
    assert !page.has_selector?(side_nav_menu_open_selector)
  end
end
