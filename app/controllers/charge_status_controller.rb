# frozen_string_literal: true

class ChargeStatusController < ApplicationController
  def index
    @page_title = '充電中'
    # セッション（充電情報）の設定
    !session[:charge_spot_id].present? ? session[:charge_spot_id] = params[:spot_id] : nil
    !session[:charge_start_time].present? ? session[:charge_start_time] = Time.zone.now.in_time_zone('Asia/Tokyo').to_s : nil

    # セッション（順番予約）の情報削除
    session[:reservation_time] = nil
    session.delete(:temporary_spot_id)

    # セッション（時間予約）の情報削除
    session[:time_reservation_spot_id] = nil
    session[:time_reservation_spot_name] = nil
    session[:time_reservation_index] = nil

    # ログ取得
    Userlog.new.insert(session[:user_name].to_s, 'charge_status', nil, params.to_s)
  end
end
