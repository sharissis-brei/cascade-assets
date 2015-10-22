class HomeController < ApplicationController
  def index
    @one_column_pages   = html_files_in 'one_column'
    @two_column_pages   = html_files_in 'two_column'
    @three_column_pages = html_files_in 'three_column'
  end

  def one_column
    render template: "one_column/#{params[:page]}", layout: 'one_column'
  end

  def two_column
    render template: "two_column/#{params[:page]}", layout: 'two_column'
  end

  def three_column
    render template: "three_column/#{params[:page]}", layout: 'three_column'
  end

  private
    def html_files_in(folder)
      extention = '.html.erb'
      Dir[Rails.root.join('app', 'views', folder, '*' + extention)].map do |path|
        File.basename(path, extention)
      end
    end
end