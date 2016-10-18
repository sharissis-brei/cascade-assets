module DataDefinitions
  class AdLanding < DataDefinitions::Base
    # XML XPath Selectors
    XPATH = {
      header_text: '//group[@identifier="header"]/text[@identifier="headerText"]',
      background_image: '//group[@identifier="hero"]//asset[@identifier="fileLink"]',
      hero_title: '//group[@identifier="hero"]/text[@identifier="title"]',
      hero_subtitle: '//group[@identifier="hero"]/text[@identifier="subtitle"]',
      form_title: '//group[@identifier="form"]/text[@identifier="title"]'
    }.freeze

    # Preset Data Values
    DEFAULTS = {
      # Selector => Value
      XPATH[:header_text] => 'MAKING <strong>BOLD</strong> STEPS',
      XPATH[:background_image] => '/_assets/ad_landing_page/dmac-masthead.jpg',
      XPATH[:hero_title] => 'Turn your passion, knowledge, and experience into a rewarding career',
      XPATH[:hero_subtitle] => 'Earn your Masters Degree at Dodge College of Film and Media Arts.',
      XPATH[:form_title] => 'Take the first step to advance your career.'
    }.freeze

    # Class Methods
    def self.default
      ad_landing = DataDefinitions::AdLanding.new

      DataDefinitions::AdLanding::DEFAULTS.each do |xpath, value|
        node = ad_landing.document.at_xpath(xpath)
        raise "Node at xpath #{xpath} not found." unless node
        node.content = value
      end

      ad_landing
    end

    # Instance Methods
    # rubocop:disable Rails/OutputSafety
    def header_text
      document.at_xpath(XPATH[:header_text]).content.html_safe
    end
    # rubocop:enable Rails/OutputSafety

    def background_image
      document.at_xpath(XPATH[:background_image]).content
    end

    def hero_title
      document.at_xpath(XPATH[:hero_title]).content
    end

    def hero_subtitle
      document.at_xpath(XPATH[:hero_subtitle]).content
    end

    def form_title
      document.at_xpath(XPATH[:form_title]).content
    end
  end
end
