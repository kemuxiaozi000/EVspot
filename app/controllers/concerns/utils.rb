# frozen_string_literal: true

module Utils
  extend ActiveSupport::Concern

  # 緯度経度の指定半径の範囲を配列で返却
  # @param :lat 緯度
  #        :lon 経度
  #        :radius 半径
  # @return [lat_from, lat_to, lon_from, lon_to]
  def get_latlon_rad(lat, lon, radius)
    lat_from = lat - (radius.to_f / 30.8184 * 0.000277778)
    lon_from = lon - (radius.to_f / 25.2450 * 0.000277778)
    lat_to = lat + (radius.to_f / 30.8184 * 0.000277778)
    lon_to = lon + (radius.to_f / 25.2450 * 0.000277778)
    [lat_from, lat_to, lon_from, lon_to]
  end

  # 指定文字列で文字列を分割して配列で返却
  # @param :string 文字列
  #        :word 分割文字列(string型)
  # @return 指定文字列で分割された配列
  def devide_string(string, word)
    string.split(word)
  end
end
