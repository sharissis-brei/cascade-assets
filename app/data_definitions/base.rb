module DataDefinitions
  class Base
    attr_accessor :document

    def initialize
      xml_file = format('%s.xml', self.class.name.underscore.split('/').last)
      xml_path = File.join(Rails.root, 'app/data_definitions/from_cascade', xml_file)
      @document = Nokogiri::XML(File.read(xml_path)) if File.exist?(xml_path)
    end

    # rubocop:disable Rails/OutputSafety
    def get_child_value(field, unescaped=false)
      # Mirrors $element.getChild('foo').value used in Cascade Velocity formats
      xpath = self.class::XPATH[field]
      raise "There is no xpath set for field #{field}." unless xpath

      node = document.at_xpath(xpath)
      raise "Node at xpath #{xpath} not found." unless node

      value = node.content
      unescaped ? value.html_safe : value
    end
    # rubocop:enable Rails/OutputSafety
  end
end
