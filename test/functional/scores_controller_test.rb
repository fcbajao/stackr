require 'test_helper'

class ScoresControllerTest < ActionController::TestCase
  test "top stackrs" do
    get :index
	assert_response :success
	resp = ActiveSupport::JSON.decode(@response.body)
	#puts YAML::dump(resp)
	assert_equal resp["today"], [
		{"score" => { "username" => "ricecake", "lines_made" => 40 }},
		{"score" => { "username" => "erick", "lines_made" => 30 }}
	], "Today data is incorrect"
	
	assert_equal resp["all"], [
		{"score" => { "username" => "ricecake", "lines_made" => 40 }},
		{"score" => { "username" => "bar", "lines_made" => 35 }},
		{"score" => { "username" => "james", "lines_made" => 34 }},
		{"score" => { "username" => "jen", "lines_made" => 33 }},
		{"score" => { "username" => "erick", "lines_made" => 30 }},
		{"score" => { "username" => "foo", "lines_made" => 30 }}
	], "All-time data is incorrect"
	
	assert_equal resp["week"], [
		{"score" => { "username" => "ricecake", "lines_made" => 40 }},
		{"score" => { "username" => "bar", "lines_made" => 35 }},
		{"score" => { "username" => "erick", "lines_made" => 30 }},
		{"score" => { "username" => "foo", "lines_made" => 30 }}
	], "Week data is incorrect"
	
	assert_equal resp["month"], [
		{"score" => { "username" => "ricecake", "lines_made" => 40 }},
		{"score" => { "username" => "bar", "lines_made" => 35 }},
		{"score" => { "username" => "james", "lines_made" => 34 }},
		{"score" => { "username" => "jen", "lines_made" => 33 }},
		{"score" => { "username" => "erick", "lines_made" => 30 }},
		{"score" => { "username" => "foo", "lines_made" => 30 }}
	], "Month data is incorrect"
  end
end
