# frozen_string_literal: true

class Api::Map::SpotinfoController < ApplicationController
  protect_from_forgery except: :index

  # スポット情報画面　スポット情報取得処理
  #
  # @param :address 住所
  # @return スポットテーブルの構造体 + key:supplier value:提供者テーブルの構造体
  def index
    # 住所
    address = params[:address].to_s
    address_latlon = Geocode.new.upsert_by_address(address)
    puts 'address_latlon'
    puts address_latlon
    # スポット情報の取得
    @result = Spot.new.select_all_by_latlon(address_latlon)
    render json: @result
  end
end
