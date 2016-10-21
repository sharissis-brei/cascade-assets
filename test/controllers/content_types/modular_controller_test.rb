#
# Test for controller/content_types/modular_controller.rb
#
# Tests will spit out a lot of output to console as they compile assets in the controller
# with each request.
#
# To run individually:
#   rake test test/controllers/content_types/modular_controller_test.rb
#
require 'test_helper'

module ContentTypes
  class ModularControllerTest < ActionController::TestCase
    test "get Ad Landing page" do
      get :ad_landing
      assert_response :success
    end
  end
end
