module DataDefinitions
  class Base
    attr_accessor :document

    def initialize
      xml_file = format('%s.xml', self.class.name.underscore.split('/').last)
      xml_path = File.join(Rails.root, 'app/data_definitions/from_cascade', xml_file)
      @document = Nokogiri::XML(File.read(xml_path)) if File.exist?(xml_path)
    end
  end
end
