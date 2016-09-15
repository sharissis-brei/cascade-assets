require 'test_helper'

class DashboardControllerTest < ActionController::TestCase
  test "get index view" do
    get :index
    assert_response :success
  end

  test 'get home page sample' do
    get :home_page, page: 'sample'
    assert_response :success
  end

  test 'get ad landing page sample' do
    get :ad_landing_page, page: 'sample'
    assert_response :success
  end
end
