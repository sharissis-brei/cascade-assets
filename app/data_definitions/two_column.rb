module DataDefinitions
  class TwoColumn < DataDefinitions::Base
    # XML XPath Selectors
    XPATH = {
      masthead_type: '//group[@identifier="masthead"]/text[@identifier="mastheadType"]',
      branded_masthead_display_image: '//group[@identifier="branded-masthead"]' \
                                      '/text[@identifier="display-image"]',
      branded_masthead_header: '//group[@identifier="branded-masthead"]' \
                               '/text[@identifier="header"]',
      branded_masthead_subtitle: '//group[@identifier="branded-masthead"]' \
                                 '/text[@identifier="sub-title"]',
      branded_masthead_image_path: '//group[@identifier="branded-masthead"]' \
                                   '/asset[@identifier="image"]'
    }.freeze

    # Preset Data Values
    DEFAULTS = {
      XPATH[:masthead_type] => 'Branded Masthead',
      XPATH[:branded_masthead_display_image] => 'Yes',
      XPATH[:branded_masthead_header] => 'Branded Masthead Header',
      XPATH[:branded_masthead_subtitle] => 'A subtitle for your branded masthead header.',
      XPATH[:branded_masthead_image_path] => '/_assets/mastheads/masthead-general-branded.jpg'
    }.freeze

    # Class Methods
    def self.default
      two_column = DataDefinitions::TwoColumn.new
      two_column.set_defaults
      two_column
    end
  end
end
