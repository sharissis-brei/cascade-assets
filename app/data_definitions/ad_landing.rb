module DataDefinitions
  class AdLanding < DataDefinitions::Base
    # If valid value not used, form will not load and just display 'Loading...'
    VALID_SLATE_FORM_ID = '4c37abdc-d5ba-4313-99b6-89b7a869ac37'.freeze

    # rubocop:disable Metrics/LineLength
    # XML XPath Selectors
    XPATH = {
      desktop_logo_src: '//group[@identifier="desktopLogoFields"]/asset[@identifier="fileLink"]',
      desktop_logo_alt: '//group[@identifier="desktopLogoFields"]/text[@identifier="alternateText"]',
      mobile_logo_src: '//group[@identifier="mobileLogoFields"]/asset[@identifier="fileLink"]',
      mobile_logo_alt: '//group[@identifier="mobileLogoFields"]/text[@identifier="alternateText"]',
      header_text: '//group[@identifier="header"]/text[@identifier="headerText"]',
      background_image: '//group[@identifier="hero"]//asset[@identifier="fileLink"]',
      hero_title: '//group[@identifier="hero"]/text[@identifier="title"]',
      hero_subtitle: '//group[@identifier="hero"]/text[@identifier="subtitle"]',
      form_title: '//group[@identifier="form"]/text[@identifier="title"]',
      form_id: '//group[@identifier="form"]/text[@identifier="formId"]'
    }.freeze

    # Preset Data Values
    DEFAULTS = {
      # Selector => Value
      XPATH[:header_text] => 'MAKING <strong>BOLD</strong> STEPS',
      XPATH[:desktop_logo_src] => '/_assets/ad_landing_page/desktop_logo.svg',
      XPATH[:desktop_logo_alt] => 'desktop logo',
      XPATH[:mobile_logo_src] => '/_assets/ad_landing_page/mobile_logo.svg',
      XPATH[:mobile_logo_alt] => 'mobile logo',
      XPATH[:background_image] => '/_assets/ad_landing_page/dmac-masthead.jpg',
      XPATH[:hero_title] => 'Turn your passion, knowledge, and experience into a rewarding career',
      XPATH[:hero_subtitle] => 'Earn your Masters Degree at Dodge College of Film and Media Arts.',
      XPATH[:form_title] => 'Take the first step to advance your career.',
      XPATH[:form_id] => VALID_SLATE_FORM_ID
    }.freeze
    # rubocop:enable Metrics/LineLength

    # Class Methods
    def self.default
      ad_landing = DataDefinitions::AdLanding.new
      ad_landing.set_defaults
      ad_landing
    end
  end
end
