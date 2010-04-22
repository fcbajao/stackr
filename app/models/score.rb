class Score < ActiveRecord::Base
	validates_presence_of :username, :lines_made
	validates_length_of :username, :maximum => 30
end
