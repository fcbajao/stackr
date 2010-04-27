class ScoresController < ApplicationController

	def create
		# check first if its an AJAX request
		if request.xhr?
			# hash the passed lines_made with the token in the session
			require "digest"
			hash = Digest::MD5.hexdigest(session[:token] + params[:lines_made])
			
			# confirm that score is valid, hashes should match
			if hash == params[:hash]
		
				@score = Score.new(
				:username => params[:username],
				:lines_made => params[:lines_made]
				)
				
				respond_to do |format|
					if @score.save
						format.html { render :json => { :stat => "OK" } }
					else
						format.html { render :json => { :stat => "FAIL", :msg => "A problem occurred while submitting your score.  Please try again." } }
					end
				end
			
			else
			
				respond_to do |format|
					format.html { render :json => { :stat => "FAIL", :msg => "Invalid score.  Please try again." } }
				end
			
			end
		else
			respond_to do |format|
				format.html { render :json => { :stat => "FAIL", :msg => "Invalid request.  Please try again." } }
			end
		end
	end
	
	def index
		time_now = Time.now.to_i
		
		# get the top 10 All-time
		scores_all = Score.all(:select => "username, lines_made", :limit => 10, :order => "lines_made DESC")
		
		# get the top 10 for the month
		scores_month = Score.all(:select => "username, lines_made", :limit => 10, :order => "lines_made DESC", :conditions => ["updated_at >= ? ", 1.month.ago])
		
		# get the top 10 for the week
		scores_week = Score.all(:select => "username, lines_made", :limit => 10, :order => "lines_made DESC", :conditions => ["updated_at >= ? ", 1.week.ago])
		
		# get the top 10 for the day
		scores_today = Score.all(:select => "username, lines_made", :limit => 10, :order => "lines_made DESC", :conditions => ["updated_at >= ? ", 1.day.ago])
		
		@scores = {
			:all => scores_all,
			:month => scores_month,
			:week => scores_week,
			:today => scores_today
		}
		
		respond_to do |format|
			format.json { render :json => @scores }
		end
	end

end
