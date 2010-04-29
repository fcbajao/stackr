require 'test_helper'

class ScoreTest < ActiveSupport::TestCase
  test "score should not save without username" do
	score = Score.new
	score.lines_made = 30
    assert !score.save, "Score saved without username"
  end
  
  test "score should not save without lines_made" do
	score = Score.new
	score.username = "popoy"
    assert !score.save, "Score saved without lines made"
  end
  
  test "score should not save if username is more than 30 characters" do
	score = Score.new
	score.username = "popoypopoypopoypopoypopoypopoypopoypopoy"
    assert !score.save, "Score saved even if username has more than 30 chars"
  end
end
