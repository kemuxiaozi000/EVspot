# frozen_string_literal: true

class LoginController < ApplicationController
  def index
    @page_title = 'ログイン'

    # ログ取得
    Userlog.new.insert(session[:user_name].to_s, 'login', nil, params.to_s)
  end
end
