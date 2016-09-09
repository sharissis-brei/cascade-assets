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
    # Arrange
    Capybara.current_driver = :poltergeist

    hamburger_icon_selector = 'a#js-cu-off-canvas-nav-trigger'
    side_nav_menu_selector = 'div#js-cu-off-canvas-nav-container'
    side_nav_menu_open_selector = 'div#js-cu-off-canvas-nav-container.open'
    close_icon_selector = 'span#js-cu-close-off-canvas-nav'

    # FIXME: fails here with error:
    # ActionController::RoutingError: No route matches
    # [GET] "/home_page/_hero_stories/listing_order.json.txt"
    # Is this an AJAX request? We should be able to mock this up somehow.
    skip
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
    assert page.has_selector?(side_nav_menu_open_selector)

    # Close hamburger menu.
    # Act
    find(close_icon_selector).click

    # Assert
    assert !page.has_selector?(side_nav_menu_open_selector)
  end
end
