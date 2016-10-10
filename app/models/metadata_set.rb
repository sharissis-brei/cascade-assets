#
# Tableless model simulating Metadata Sets in Cascade: Administration > Metadata Sets
#
class MetadataSet < Tableless
  column :name, :string
  column :display_name, :string
  column :title, :string
  column :description, :string
  column :keywords, :string

  validates :name, presence: true

  def self.page(options = {})
    metadata_set = MetadataSet.new(name: 'page')
    metadata_set.display_name = options.fetch(:display_name, 'MetadataSet Display Name')
    metadata_set.title = options.fetch(:title, 'MetadataSet Title')
    metadata_set.description = options.fetch(:description, 'MetadataSet description.')
    metadata_set.keywords = options.fetch(:keywords, 'MetadataSet keywords')
    metadata_set
  end
end
