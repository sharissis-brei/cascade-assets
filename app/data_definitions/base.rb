module DataDefinitions
  class Base
    attr_accessor :document

    def initialize
      @document = Nokogiri::XML(self.class::CASCADE_XML) if self.class::CASCADE_XML
    end
  end
end
