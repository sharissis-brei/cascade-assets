module DataDefinitions
  class ThreeColumn < DataDefinitions::Base
    # XML XPath Selectors
    # XML XPath Selectors
    XPATH = {
      masthead_type: '//group[@identifier="masthead"]/text[@identifier="mastheadType"]',

      branded_header: '//group[@identifier="branded201611"]/text[@identifier="header"]',
      branded_image_path: '//group[@identifier="branded201611"]/asset[@identifier="image"]',
      branded_alt_text: '//group[@identifier="branded201611"]/text[@identifier="altText"]',

      branded_old_display_image: '//group[@identifier="branded-masthead"]' \
                                      '/text[@identifier="display-image"]',
      branded_old_header: '//group[@identifier="branded-masthead"]' \
                               '/text[@identifier="header"]',
      branded_old_subtitle: '//group[@identifier="branded-masthead"]' \
                                 '/text[@identifier="sub-title"]',
      branded_old_image_path: '//group[@identifier="branded-masthead"]' \
                                   '/asset[@identifier="image"]'
    }.freeze

    # Preset Data Values
    DEFAULTS = {
      XPATH[:masthead_type] => 'Branded Masthead',

      XPATH[:branded_header] => 'A Brand New Branded Masthead',
      XPATH[:branded_image_path] => '/_assets/mastheads/branded-new.jpg',
      XPATH[:branded_alt_text] => 'Branded - New alt text',

      XPATH[:branded_old_display_image] => 'Yes',
      XPATH[:branded_old_header] => 'Branded Masthead Header',
      XPATH[:branded_old_subtitle] => 'A subtitle for your branded masthead header.',
      XPATH[:branded_old_image_path] => '/_assets/mastheads/masthead-general-branded.jpg'
    }.freeze

    # Class Methods
    def self.default
      three_column = DataDefinitions::ThreeColumn.new
      three_column.set_defaults
      three_column
    end
  end
end
