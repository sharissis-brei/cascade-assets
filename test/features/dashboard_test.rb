#
# Basic Feature Test
#
# To generate:
#   rails g minitest:feature Dashboard --spec
#
# To run individually:
#   rake test test/features/dashboard_test.rb
#
require "test_helper"

feature "Dashboard" do
  scenario "the test is sound" do
    # Arrange
    # Use poltergeist driver for headless broswer testing with phantomjs.
    Capybara.javascript_driver = :poltergeist

    # Act
    visit root_path

    # Assert
    assert page.has_selector? 'h1:first', text: "Sample Cascade Pages"
  end
end
