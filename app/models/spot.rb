# frozen_string_literal: true

require 'concerns/utils'

class Spot < ApplicationRecord
  include Utils

  # 緯度経度から付近のスポット情報を取得
  def select_all_by_latlon(address_latlon)
    latlon_arr = get_latlon_rad(address_latlon.latitude, address_latlon.longitude, 5000)
    spot_data = Spot.where(lat: latlon_arr[0]..latlon_arr[1])
                    .where(lon: latlon_arr[2]..latlon_arr[3])
    result = {}
    arr = []
    spot_data.each do |data|
      result_data = {}
      result_data['id'] = data.id
      result_data['name'] = data.name
      result_data['lat'] = data.lat
      result_data['lon'] = data.lon
      result_data['coupon_id'] = data.coupon_id
      result_data['supplier_id'] = data.supplier_id
      result_data['detail_id'] = data.detail_id
      result_data['supplier'] = Supplier.new.select_all_by_id_arr(devide_string(data.supplier_id.to_s, ':'))
      arr.push(result_data)
    end
    result['spot'] = arr
    result['position'] = address_latlon
    result
  end

  # クーポンIDからスポット情報を取得する処理
  def select_all_by_couponid(coupon_id)
    spot_data = Spot.where(coupon_id: coupon_id.to_s).limit(1)
    spot_data[0].id
  end

  # 詳細画面用スポット情報の取得処理
  def select_all_by_id_for_detail(spot_id, supplier_id)
    spot_data = Spot.where(id: spot_id)
    result = {}
    spot_data.each do |data|
      result['id'] = data.id
      result['name'] = data.name
      result['lat'] = data.lat
      result['lon'] = data.lon
      result['coupon_id'] = data.coupon_id
      result['supplier_id'] = data.supplier_id
      result['detail_id'] = data.detail_id
      result['supplier'] = supplier_id.zero? ? Supplier.new.select_all_by_id_arr(devide_string(data.supplier_id.to_s, ':')) : Supplier.new.select_by_id(supplier_id)
      result['coupon'] = Coupon.new.select_all_by_id_arr(devide_string(data.coupon_id.to_s, ':'))
      result['detail'] = SpotDetail.new.select_by_id(data.detail_id.to_i)
    end
    result
  end
end
