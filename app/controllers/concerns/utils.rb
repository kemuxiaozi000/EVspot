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

  # 発電種別による絞り込み
  def get_photo(data)
    image = data['photo'].present? ? data['photo'] : 'no_image.png'
    ActionController::Base.helpers.asset_path image, type: :image
  end

  # 発電種別による絞り込み
  def get_electric_photo(data)
    electric_image = data['name'] == 'NGE' ? 'nge48.png' : 'other_electric.png'
    case data['origin']
    when '太陽光' then electric_image = 'sun_electric.jpg'
    when '火力' then electric_image = 'fire_electric.jpg'
    when '風力' then electric_image = 'wind_electric.jpg'
    when '水力' then electric_image = 'water_electric.jpg'
    when '地熱' then electric_image = 'geothermal_electric.jpg'
    when '原子力' then electric_image = 'newclear_electric.png'
    end
    ActionController::Base.helpers.asset_path electric_image, type: :image
  end
end
