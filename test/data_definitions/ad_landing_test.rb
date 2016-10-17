#
# AdLanding Data Definition Test
# To run individually:
#
#
require 'test_helper'

class AdLandingDataDefinitionTest < ActiveSupport::TestCase
  test 'expects data definition to parse Cascade XML as XML document' do
    # Act
    dd = DataDefinitions::AdLanding.new

    # Assert
    assert_not_nil dd.document
    assert_instance_of(Nokogiri::XML::Document, dd.document)
  end

  test "expects default initializer to set default data values" do
    # Assume
    xpath_selector = '//group[@identifier="form"]/text[@identifier="title"]'
    expected_value = 'Take the first step to advance your career.'

    # Act
    dd = DataDefinitions::AdLanding.default

    # Assert
    assert_equal(dd.document.at_xpath(xpath_selector).content, expected_value)
  end
end
