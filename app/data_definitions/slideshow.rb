module DataDefinitions
  class Slideshow < DataDefinitions::Base
    # XML XPath Selectors
    XPATH = {}.freeze

    # Preset Data Values
    DEFAULTS = {}.freeze

    # Class Methods
    def self.default
      one_column = DataDefinitions::Slideshow.new
      one_column.set_defaults
      one_column
    end
  end
end
