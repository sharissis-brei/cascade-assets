#
# Tabless Model Base Class
#
# Not sure this is the best way to do this. ActiveRecord seems to require a database connection
# of some type. This avoids ActiveRecord and uses ActiveModel.
#
# References:
# - https://gist.github.com/matpowel/1101257
# - https://github.com/rails/rails/tree/master/activemodel
#
class Tableless
  include ActiveModel::Model

  def self.column(name, sql_type = nil, default = nil, null = true)
    columns << TablelessColumn.new(name.to_s, default, sql_type.to_s, null)
    self.__send__(:attr_accessor, name)
  end

  def self.columns()
    @columns ||= [];
  end

  def self.column_names
    self.columns.collect{|column| column.name}
  end

  def self.columns_hash
    h = {}
    for c in self.columns
      h[c.name] = c
    end
    return h
  end

  def self.column_defaults
    Hash[self.columns.map{ |col|
      [col.name, col.default]
    }]
  end

  def self.descends_from_active_record?
    return true
  end

  def persisted?
    return false
  end

  # override the save method to prevent exceptions
  def save( validate = true )
    validate ? valid? : true
  end
end


class TablelessColumn
  attr_accessor :name, :sql_type, :default, :null

  def initialize(name, default, sql_type, null)
    @name = name
    @sql_type = sql_type
    @default = default
    @null = null
  end

  def to_s
    name
  end
end
