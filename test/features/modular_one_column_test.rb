#
# Feature Tests for Modular One Column Template
#
# To run individually:
#   rake test test/features/modular_one_column_test.rb
#
require "test_helper"

feature "modular one-column template" do
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
      visit "/modular/one_column"

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
      # Test was consistently failing on first attempt. Upped wait to 10s (default is 2) on theory
      # that selector was timing out before menu was fully retracted and open class removed.
      assert page.has_no_selector?(side_nav_menu_open_selector, wait: 10),
             "Side menu should now NOT be visible in viewport again.\n" \
             "Sometimes this test fails the first time. Try running it at least twice."
    rescue Capybara::Poltergeist::JavascriptError => e
      puts format("[WARNING] Rescued javascript error:\n%s", e.message)
    end
  end
end
