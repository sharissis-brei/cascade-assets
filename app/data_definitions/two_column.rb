module DataDefinitions
  class TwoColumn < DataDefinitions::Base
    # XML XPath Selectors
    XPATH = {
      masthead_type: '//group[@identifier="masthead"]/text[@identifier="mastheadType"]',

      branded_header: '//group[@identifier="branded201611"]/text[@identifier="header"]',
      branded_image_path: '//group[@identifier="branded201611"]/asset[@identifier="image"]',
      branded_alt_text: '//group[@identifier="branded201611"]/text[@identifier="altText"]',

      v201611_header: '//group[@identifier="slider201611"]/text[@identifier="header"]',

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

      XPATH[:v201611_header] => 'Campus Life at Chapman University',

      XPATH[:branded_old_display_image] => 'Yes',
      XPATH[:branded_old_header] => 'Branded Masthead Header',
      XPATH[:branded_old_subtitle] => 'A subtitle for your branded masthead header.',
      XPATH[:branded_old_image_path] => '/_assets/mastheads/masthead-general-branded.jpg'
    }.freeze

    # Preset data as hash representing Cascade XML data.
    CASCADE_DATA = {
      old: {
        slider: {
          slides: [
            {
              'header' => 'Slider Slide #1',
              'sub-title' => 'Slide #1 of 2',
              'description' => 'A slide description',
              'altText' => 'image alt attribute here',
              'text-background' => 'Solid Red',
              'quote-author' => 'A.Q. Author',
              'align' => 'bottom-left',
              'link' => {
                'link' => '/modular/two_column',
                'internalLink' => {'path' => '/'},
                'fileLink' => {'path' => '/'}
              },
              'image' => {'path' => '/_assets/mastheads/slider-old.jpg'}
            },
            {
              'header' => 'Slider Slide #2',
              'sub-title' => 'Slide #2 of 2',
              'description' => '',
              'altText' => 'image alt attribute here',
              'text-background' => 'Transparent Black',
              'quote-author' => '',
              'align' => 'bottom-left',
              'link' => {
                'link' => '/',
                'internalLink' => {'path' => '/modular/two_column'},
                'fileLink' => {'path' => '/'}
              },
              'image' => {'path' => '/_assets/mastheads/slider-old.jpg'}
            }
          ]
        }
      },

      v201611: {
        slider: {
          header: 'Campus Life at Chapman University',

          slides: [
            {
              subTitle: '',
              altText: 'the altText is not the alt-right',
              photoBy: 'I.M. Photographer',
              image: {path: '/_assets/mastheads/slider-v201611.jpg'}
            },
            {
              subTitle: 'Optional text can go here',
              altText: 'image alt attribute here',
              photoBy: '',
              image: {path: '/_assets/mastheads/slider-v201611.jpg'}
            },
            {
              subTitle: 'Slider Slide \n #3 of 3',
              altText: 'image alt attribute here',
              photoBy: '',
              image: {path: '/_assets/mastheads/slider-v201611.jpg'}
            }
          ]
        }
      }
    }.freeze

    # Class Methods
    def self.default
      two_column = DataDefinitions::TwoColumn.new
      two_column.set_defaults
      two_column
    end
  end
end
