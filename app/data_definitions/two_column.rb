module DataDefinitions
  class TwoColumn < DataDefinitions::Base
    # XML XPath Selectors
    XPATH = {
      masthead_type: '//group[@identifier="masthead"]/text[@identifier="mastheadType"]'
    }.freeze

    # Preset Data Values
    DEFAULTS = {
      XPATH[:masthead_type] => 'Branded Masthead'
    }.freeze

    # Class Methods
    def self.default
      two_column = DataDefinitions::TwoColumn.new
      two_column.set_defaults
      two_column
    end
  end
end
