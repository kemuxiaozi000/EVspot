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
      result_data['supplier'] = Supplier.new.select_by_id(devide_string(data.supplier_id.to_s, ':'))
      arr.push(result_data)
    end
    result['spot'] = arr
    result['position'] = address_latlon
    result
  end

  # 緯度経度から付近のスポット情報を取得(new)
  def select_by_latlon_new(lat, lon)
    sql = get_arround_sql(lat, lon, 5)
    spot_data = ActiveRecord::Base.connection.select_all(sql)
    result = {}
    result['spot'] = data_input(spot_data)
    position_struct = Struct.new(:latitude, :longitude)
    position = position_struct.new(lat.to_f, lon.to_f)
    result['position'] = position
    result
  end

  def data_input(spot_data)
    arr = []
    spot_data.each do |data|
      result_data = {}
      result_data['id'] = data['id']
      result_data['name'] = data['name']
      result_data['lat'] = data['lat']
      result_data['lon'] = data['lon']
      result_data['coupon_id'] = data['coupon_id']
      result_data['supplier_id'] = data['supplier_id']
      result_data['detail_id'] = data['detail_id']
      result_data['detail_data'] = SpotDetail.new.select_by_id(data['detail_id'])
      result_data['supplier'] = Supplier.new.select_by_id(devide_string(data['supplier_id'].to_s, ':'))
      arr.push(result_data)
    end
    arr
  end

  def get_arround_sql(lat, lon, num)
    sql_select = 'select id,name,lat,lon,coupon_id,supplier_id,detail_id '
    sql_select += "from(SELECT id,name,lat,lon,coupon_id,supplier_id,detail_id,GLength(GeomFromText(CONCAT('LineString("
    sql_select += lon
    sql_select += ' '
    sql_select += lat
    sql_select += ",', lon, ' ', lat,')'))) * 111.3194 AS distance FROM spots ORDER BY distance) as cus where distance <= :num"

    sql = ActiveRecord::Base.send(
      :sanitize_sql_array,
      [
        sql_select,
        num: num
      ]
    )
    sql
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
