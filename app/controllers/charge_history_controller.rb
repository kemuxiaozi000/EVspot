# frozen_string_literal: true

class ChargeHistoryController < ApplicationController
  def index
    @page_title = '充電履歴'
    # 充電履歴の取得
    @history_list = History.new.select_all

    # ログ取得
    Userlog.new.insert(session[:user_name].to_s, 'charge_history', nil, params.to_s)
  end
end
