# frozen_string_literal: true

class Api::Map::SpotinfolatlonController < ApplicationController
  protect_from_forgery except: :index

  # スポット情報画面　スポット情報取得処理
  #
  # @param :lat
  # @param :lon
  # @zoom  :zoom
  # @return スポットテーブルの構造体 + key:supplier value:提供者テーブルの構造体
  def index
    Userlog.new.insert(session[:user_name], 'map', 'スポット情報取得処理', params.to_s)
    # 住所
    lat = params[:lat].to_s
    lon = params[:lon].to_s
    # zoom level
    zoom = params[:zoom].to_i

    # スポット情報の取得
    @result = Spot.new.select_by_latlon_zoom(lat, lon, get_range(zoom), params)
    @result['watingtime'] = Common.new.select_by_watingtime
    render json: @result
  end

  # スポット一覧取得
  # @param  :lat
  # @param  :lon
  # @range  :range
  # @return スポットIDリスト
  def read
    Userlog.new.insert(session[:user_name], 'map', 'スポット一覧取得', params.to_s)
    # 位置
    lat = params[:lat].to_s
    lon = params[:lon].to_s
    # 範囲
    range = params[:range].to_i
    # スポット一覧取得
    @result = Spot.new.select_by_latlon_zoom(lat, lon, range, params)
    render json: @result
  end

  # zoom率から取得範囲の算出
  def get_range(zoom)
    result = case zoom
             when 0..4
               0
             when 5..6
               100
             when 7..8
               50
             else
               20
             end
    result
  end
end
