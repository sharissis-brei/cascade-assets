#
# Tableless model simulating Metadata Sets in Cascade: Administration > Configuration Sets
#
# Model pattern based on http://stackoverflow.com/a/11199814/6763239
#
class ConfigurationSet
  include ActiveModel::Model

  # Virtual columns
  attr_accessor :name,          # ConfigurationSet type (e.g., 1 Column, 2 Column, etc.)
                :template,
                :format,
                :publishable,
                :file_extension,
                :serialization_type,
                :include_xml_declaration,
                :default_output

  validates :template, presence: true

  def self.one_column(options = {})
    configuraton_set = ConfigurationSet.new(name: '1 Column')
    configuraton_set.template = options.fetch(:template,
                                              '_cascade/templates/modular/one_column.html')
    configuraton_set.publishable = true
    configuraton_set.file_extension = '.aspx'
    configuraton_set.serialization_type = 'HTML'
    configuraton_set.include_xml_declaration = false
    configuraton_set.default_output = true

    configuraton_set
  end
end
