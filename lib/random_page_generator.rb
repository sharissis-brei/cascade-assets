require 'faker'
require 'yaml'
require 'awesome_print'

class RandomPageGenerator

  WIDGET_DIR  = File.expand_path('../docs/_includes/modules', File.dirname(__FILE__))
  DESTINATION = File.expand_path('../docs/random', File.dirname(__FILE__))

  def initialize
    @layouts                 = ['2_column_modular', '3_column_modular']
    @mastheads               = files_in 'masthead'
    @left_column_widgets     = files_in 'left_column'
    @right_column_widgets    = files_in 'right_column'
    @primary_content_widgets = files_in 'primary_content'
  end

  def generate(num)
    (0..num-1).each do |index|
      page = {}
      page["title"]           = Faker::Company.catch_phrase
      page["layout"]          = @layouts.sample
      page["masthead"]        = @mastheads.sample
      page["left_column"]     = @left_column_widgets.sample(1 + rand(8))
      page["primary_content"] = @primary_content_widgets.sample(1 + rand(8))
      page["right_column"]    = @right_column_widgets.sample(1 + rand(8)) if page["layout"][0] == '3'
      page["random"]          = true

      File.write(File.join(DESTINATION, "#{index}.html"), page.to_yaml + '---')
    end
  end

  def files_in(dir)
    path = File.join(WIDGET_DIR, dir)
    Dir["#{path}/*.html"].map do |f|
      File.basename(f, '.html')
    end
  end
end