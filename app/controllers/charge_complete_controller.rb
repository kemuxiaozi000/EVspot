# frozen_string_literal: true

class ChargeCompleteController < ApplicationController
  def index
    @page_title = '充電完了'
    # セッション（充電情報）の削除
    session.delete(:charge_spot_id)
    session.delete(:charge_start_time)

    # ログ取得
    Userlog.new.insert(session[:user_name].to_s, 'charge_complete', nil, params.to_s)

    # 履歴情報の取得
    @history = History.new.select_all_by_id(params[:history_id])
    @history['photo'] = 'no_image.png' if @history['photo'].nil?
    @history = @history.as_json
  end
end
