class HomeController < ApplicationController
  def index
    # we generate a random string for the token used to hash the scores being submitted
    current_time = Time.now
    require "digest"
    @token = Digest::MD5.hexdigest(current_time.inspect)
    session[:token] = @token # store the token in the session, will be used when scores are submitted
  end

end
