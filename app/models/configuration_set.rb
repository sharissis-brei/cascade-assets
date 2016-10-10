#
# Tableless model simulating Metadata Sets in Cascade: Administration > Configuration Sets
#
# Model pattern based on http://stackoverflow.com/a/11199814/6763239
#
class ConfigurationSet < Tableless
  column :name, :string         # ConfigurationSet type (e.g., 1 Column, 2 Column, etc.)
  column :template, :string
  column :format, :string
  column :publishable, :boolean
  column :file_extension, :string
  column :serialization_type, :string
  column :include_xml_declaration, :boolean
  column :default_output, :boolean

  attr_accessor :regions        # Regions map to <system-region/> tags in template.

  validates :template, presence: true

  def self.one_column(options={})
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
