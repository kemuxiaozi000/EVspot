# frozen_string_literal: true

class ChargingController < ApplicationController
  def index
    @page_title = '充電する'

    # ログ取得
    Userlog.new.insert(session[:user_name].to_s, 'charging', nil, params.to_s)
  end
end
