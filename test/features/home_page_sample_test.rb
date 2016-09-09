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

    # Capture javascript errors. Still should fix any issues. Test will output error.
    # FIXME: Currently getting error:
    # "TypeError: Requested keys of a value that is not an object."
    # May need to better stub an AJAX response or set up test.
    begin
      visit "/home_page/sample"
    rescue Capybara::Poltergeist::JavascriptError => e
      puts format("[WARNING] Rescued javascript error:\n%s", e.message)
    end

    # Open side nav menu.
    # Assume
    assert page.has_selector?(hamburger_icon_selector)
    assert page.has_selector?(side_nav_menu_selector)
    assert page.has_no_selector?(side_nav_menu_open_selector),
           "Side menu should NOT be visible in viewport."
    assert page.has_selector?(close_icon_selector)

    # Act
    page.find(hamburger_icon_selector).click

    # Assert
    assert page.has_selector?(side_nav_menu_open_selector),
           "Side menu should now be visible in viewport."

    # Close side nav menu.
    # Act
    find(close_icon_selector).click

    # Assert
    assert page.has_no_selector?(side_nav_menu_open_selector),
           "Side menu should now NOT be visible in viewport again."
  end
end
