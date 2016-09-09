ENV['RAILS_ENV'] ||= 'test'

require File.expand_path('../../config/environment', __FILE__)

require 'rails/test_help'
require "minitest/rails/capybara"
require 'capybara/poltergeist'
require 'webmock/minitest'
require 'pp'

WebMock.disable_net_connect!(allow_localhost: true)

module WebMockery
  # Add mixin methods here.
end

module ActiveSupport
  class TestCase
    include WebMockery

    # Add more helper methods to be used by all tests here...
  end
end
