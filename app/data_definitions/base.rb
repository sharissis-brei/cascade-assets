module DataDefinitions
  class Base
    attr_accessor :name, :document

    def initialize
      @name = self.class.name.underscore.split('/').last
      xml_file = format('%s.xml', @name)
      xml_path = File.join(Rails.root, 'app/data_definitions/from_cascade', xml_file)
      @document = Nokogiri::XML(File.read(xml_path)) if File.exist?(xml_path)
    end

    def set_defaults
      self.class::DEFAULTS.each do |xpath, value|
        node = @document.at_xpath(xpath)
        raise "Node at xpath #{xpath} not found." unless node
        node.content = value
      end
    end

    def get_child(field)
      xpath = self.class::XPATH[field]
      raise "There is no xpath set for field #{field}." unless xpath

      node = document.at_xpath(xpath)
      raise "Node at xpath #{xpath} not found." unless node

      node
    end

    # rubocop:disable Rails/OutputSafety
    def get_child_value(field, unescaped=false)
      node = get_child(field)
      value = node.content
      unescaped ? value.html_safe : value
    end
    # rubocop:enable Rails/OutputSafety
  end
end
