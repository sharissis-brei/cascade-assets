#
# Feature Tests for Sample Home Page
#
# To run individually:
#   rake test test/features/home_page_sample_test.rb
#
require "test_helper"

feature "sample home page" do
  scenario "user visits home page" do
    # Arrange
    endpoint = '/home_page/sample'
    omninav_selector = 'div#cu_nav'

    # Act
    visit endpoint

    # Assert
    assert page.has_selector?(omninav_selector, visible: :visible)
  end
end
