# frozen_string_literal: true

class ChargeCompleteController < ApplicationController
  def index
    @page_title = '充電完了 - これからEVドライブ'
    # セッション（充電情報）の削除
    session.delete(:charge_spot_id)
    session.delete(:charge_start_time)

    # ログ取得
    Userlog.new.insert(session[:user_name].to_s, 'charge_complete', nil, params.to_s)
  end
end
