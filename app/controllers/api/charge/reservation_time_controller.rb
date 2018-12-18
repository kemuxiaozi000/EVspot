# frozen_string_literal: true

class Api::Charge::ReservationTimeController < ApplicationController
  protect_from_forgery except: :index

  # 時間予約に関するセッションの登録/削除を行う
  def index
    # 時間枠のインデックスが0以上の場合は、セッションに情報を登録する
    if params[:time_index].present? && !params[:time_index].to_i.negative?
      session[:time_reservation_spot_id] = params[:spot_id]
      session[:time_reservation_spot_name] = params[:spot_name]
      session[:time_reservation_index] = params[:time_index].to_i
    # 時間枠のインデックスが0より小さい場合は、セッションから情報を削除する
    else
      session.delete(:time_reservation_spot_id)
      session.delete(:time_reservation_spot_name)
      session.delete(:time_reservation_index)
    end
  end
end
