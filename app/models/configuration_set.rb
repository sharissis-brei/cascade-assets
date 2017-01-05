#
# Tableless model simulating Configuration Sets in Cascade: Administration > Configuration Sets
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

  def self.ad_landing(options={})
    configuration_set = ConfigurationSet.new(name: 'Ad Landing')
    configuration_set.set_defaults
    configuration_set.template = options.fetch(:template,
                                               '_cascade/templates/modular/ad_landing.html')
    configuration_set
  end

  def self.one_column(options={})
    configuration_set = ConfigurationSet.new(name: '1 Column')
    configuration_set.set_defaults
    configuration_set.template = options.fetch(:template,
                                               '_cascade/templates/modular/one_column.html')
    configuration_set
  end

  def self.two_column(options={})
    # default_template_path = '_cascade/templates/modular/two_column.html'
    configuration_set = ConfigurationSet.new(name: '2 Column')
    configuration_set.set_defaults
    configuration_set.template = options.fetch(:template, 
                                                '_cascade/templates/modular/two_column.html')
    configuration_set
  end

  def self.three_column(options={})
    # default_template_path = '_cascade/templates/modular/three_column.html'
    configuration_set = ConfigurationSet.new(name: '3 Column')
    configuration_set.set_defaults
    configuration_set.template = options.fetch(:template, 
                                                '_cascade/templates/modular/three_column.html')
    configuration_set
  end

  def self.slideshow(options={})
    default_template_path = '_cascade/templates/school_home_pages/slideshow.html'
    configuration_set = ConfigurationSet.new(name: 'Slideshow')
    configuration_set.set_defaults
    configuration_set.template = options.fetch(:template, default_template_path)
    configuration_set
  end

  def set_defaults
    self.template = nil
    self.publishable = true
    self.file_extension = '.aspx'
    self.serialization_type = 'HTML'
    self.include_xml_declaration = false
    self.default_output = true
    self.regions = {}
  end
end
