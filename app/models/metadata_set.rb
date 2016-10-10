#
# Tableless model simulating Metadata Sets in Cascade: Administration > Metadata Sets
#
# Model pattern based on http://stackoverflow.com/a/11199814/6763239
#
class MetadataSet
  include ActiveModel::Model

  # Virtual columns
  attr_accessor :name,          # MetadataSet type (e.g., Page, CSS File, etc.)
                :display_name,
                :title,
                :description

  validates :name, presence: true

  def self.page(options = {})
    metadata_set = MetadataSet.new(name: 'page')
    metadata_set.display_name = options.fetch(:display_name, 'MetadataSet Display Name')
    metadata_set.title = options.fetch(:title, 'MetadataSet Title')
    metadata_set.description = options.fetch(:description, 'MetadataSet description.')
    metadata_set
  end
end
