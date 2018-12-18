# frozen_string_literal: true

class Api::Login::UsercheckController < ApplicationController
  protect_from_forgery except: :index

  def index
    email = params[:email]
    pwd = params[:pwd]
    @result = ''
    @member = Member.new.user_find(email, pwd)
    puts '@member'
    puts @member
    @result = @member ? 'Success' : 'Error'
    render plain: @result
  end
end
