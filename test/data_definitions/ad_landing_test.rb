#
# AdLanding Data Definition Test
#
# To run individually:
#   rake test test/data_definitions/ad_landing_test.rb
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
    expected_header_text = 'MAKING <strong>BOLD</strong> STEPS'
    expected_background_image = '/_assets/ad_landing_page/dmac-masthead.jpg'
    expected_hero_title = 'Turn your passion, knowledge, and experience into a rewarding career'
    expected_hero_subtitle = 'Earn your Masters Degree at Dodge College of Film and Media Arts.'
    expected_form_title = 'Take the first step to advance your career.'

    # Act
    ad_landing = DataDefinitions::AdLanding.default

    # Assert
    assert_equal(ad_landing.get_child_value(:header_text, true), expected_header_text)
    assert_equal(ad_landing.get_child_value(:background_image), expected_background_image)
    assert_equal(ad_landing.get_child_value(:hero_title), expected_hero_title)
    assert_equal(ad_landing.get_child_value(:hero_subtitle), expected_hero_subtitle)
    assert_equal(ad_landing.get_child_value(:form_title), expected_form_title)
  end
end
