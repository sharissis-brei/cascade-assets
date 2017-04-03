class DashboardController < ApplicationController
  def index
    render layout: 'dashboard'
  end

  def one_column
    render template: "1_column/#{params[:page]}", layout: '1_column'
  end

  def two_column
    render template: "2_column/#{params[:page]}", layout: '2_column'
  end

  def three_column
    render template: "3_column/#{params[:page]}", layout: '3_column'
  end

  def home_page
    render template: "home_page/#{params[:page]}", layout: 'home_page'
  end

  def ad_landing_page
    render template: "ad_landing_page/#{params[:page]}", layout: 'ad_landing_page'
  end

  # Update routes config to mock out paths for development and testing.
  def mock_success
    head :ok
  end

  private

  def html_files_in(folder)
    extention = '.html.erb'
    Dir[Rails.root.join('app', 'views', folder, '*' + extention)].map do |path|
      File.basename(path, extention)
    end
  end
end
