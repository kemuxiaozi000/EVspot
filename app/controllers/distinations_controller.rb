# frozen_string_literal: true

class DistinationsController < ApplicationController
  def index
    @page_title = '行き先を探す'
    # ログ取得
    Userlog.new.insert(session[:user_name].to_s, 'distinations', nil, params.to_s)
  end
end
