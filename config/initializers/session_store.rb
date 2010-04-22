# Be sure to restart your server when you modify this file.

# Your secret key for verifying cookie session data integrity.
# If you change this key, all old sessions will become invalid!
# Make sure the secret is at least 30 characters and all random, 
# no regular words or you'll be exposed to dictionary attacks.
ActionController::Base.session = {
  :key         => '_stackr_session',
  :secret      => '1bd0dfbca3159b8afaece63f3add06ebf021baf5f615d1943fb08727009b6cac6095869dcf8a1e16714bed2a63a6858e536fcf4369ef198fc6ae7fe2f96cdf8c'
}

# Use the database for sessions instead of the cookie-based default,
# which shouldn't be used to store highly confidential information
# (create the session table with "rake db:sessions:create")
# ActionController::Base.session_store = :active_record_store
