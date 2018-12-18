# frozen_string_literal: true

class SpotController < ApplicationController
  def index
    @page_title = 'スポット一覧'

    # ログ取得
    Userlog.new.insert(session[:user_name].to_s, 'spot', nil, params.to_s)
  end
end
