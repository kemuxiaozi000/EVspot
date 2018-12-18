# frozen_string_literal: true

class PasstimeController < ApplicationController
  def index
    @page_title = '暇つぶし'
    # ログ取得
    Userlog.new.insert(session[:user_name].to_s, 'passtime', nil, params.to_s)
  end
end
