# frozen_string_literal: true

class Api::Map::SpotinfolatlonController < ApplicationController
  protect_from_forgery except: :index

  # スポット情報画面　スポット情報取得処理
  #
  # @param :lat
  # @param :lon
  # @return スポットテーブルの構造体 + key:supplier value:提供者テーブルの構造体
  def index
    # 住所
    lat = params[:lat].to_s
    lon = params[:lon].to_s
    # スポット情報の取得
    @result = Spot.new.select_by_latlon_new(lat, lon)
    @result['watingtime'] = Common.new.select_by_watingtime
    render json: @result
  end
end
