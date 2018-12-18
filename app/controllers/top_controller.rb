# frozen_string_literal: true

class TopController < ApplicationController
  def index
    @page_title = 'トップ'

    # ログ取得
    Userlog.new.insert(session[:user_name].to_s, 'top', nil, params.to_s)
  end
end
