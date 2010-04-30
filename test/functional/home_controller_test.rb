require 'test_helper'

class HomeControllerTest < ActionController::TestCase
  test "should return home page" do
	get :index
	assert_response :success
	assert_select "#newgame"
  end
end
