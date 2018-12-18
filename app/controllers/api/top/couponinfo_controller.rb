# frozen_string_literal: true

require 'date'
require 'time'

class Api::Top::CouponinfoController < ApplicationController
  protect_from_forgery except: :index

  # トップ画面　お得なクーポン取得処理
  #
  # @param :current_place_lat 緯度
  #        :current_place_lon 経度
  # @return クーポンテーブルの構造体
  def index
    # 緯度
    current_place_lat = params[:current_place_lat].to_f
    # 経度
    current_place_lon = params[:current_place_lon].to_f

    # 日付
    now_time = Time.zone.now.in_time_zone('Asia/Tokyo')
    datetime_str = now_time.year.to_s \
                    + '/' \
                    + now_time.mon.to_s \
                    + '/' \
                    + now_time.mday.to_s
    todaysdate = Date.parse(datetime_str)

    # クーポン情報の取得
    # 緯度経度が空の場合は全件取得
    # それ以外は半径5キロ以内で検索
    @result = if current_place_lat.zero? && current_place_lon.zero?
                Coupon.new.select_all_in_date_order(todaysdate)
              else
                Coupon.new.select_all_by_latlon(current_place_lat,
                                                current_place_lon, todaysdate)
              end
    render json: @result
  end
end
