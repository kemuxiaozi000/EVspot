# frozen_string_literal: true

require 'concerns/utils'

class Spot < ApplicationRecord
  include Utils

  # 緯度経度,zoom率から付近のスポット情報を取得
  def select_by_latlon_zoom(lat, lon, range, spot_detail_search_params = {})
    sql = get_arround_sql(lat, lon, range, spot_detail_search_params)
    spot_data = ActiveRecord::Base.connection.select_all(sql)
    result = {}
    result['spot'] = data_input(spot_data, spot_detail_search_params[:natural_energy])
    position_struct = Struct.new(:latitude, :longitude)
    position = position_struct.new(lat.to_f, lon.to_f)
    result['position'] = position
    result
  end

  def data_input(spot_data, natural_energy)
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
      result_data['detail_data'] = set_spot_detail_data(data)
      # SpotDetail.new.select_all_by_id(data['detail_id'])
      # result_data['supplier'] = Supplier.new.select_by_id(devide_string(data['supplier_id'].to_s, ':'))
      result_data['supplier'] = Supplier.new.select_pst_by_id(devide_string(data['supplier_id'].to_s, ':'))
      arr.push(result_data) unless natural_energy == 'on' && result_data['supplier'][0].power_supply_types_id != 0
    end
    arr
  end

  def get_arround_sql(lat, lon, num, spot_detail_search_params)
    sql_select = 'SELECT '
    sql_select += select_sql
    sql_select += 'FROM spots '
    sql_select += 'inner join spot_details on spot_details.id = spots.detail_id '
    sql_select += 'where '
    sql_select += "(GLength(GeomFromText(CONCAT('LineString("
    sql_select += lon
    sql_select += ' '
    sql_select += lat
    sql_select += ",', lon, ' ', lat,')'))) * 111.3194) <= :num "
    sql_select += SpotDetail.new.get_spot_detail_condition_sql(spot_detail_search_params)
    # インタビュー用に対象のスポット情報を必ず表示させる
    sql_select += 'or (spots.id = 895 or spots.id = 1129 or spots.id = 2378 or spots.id = 2992 or spots.id = 9691 or spots.id = 9693) '
    sql = ActiveRecord::Base.send(
      :sanitize_sql_array,
      [
        sql_select,
        num: num
      ]
    )
    sql
  end

  # select句作成
  def select_sql
    sql_select = 'spots.id as id,name,lat,lon,coupon_id,supplier_id,detail_id,'
    sql_select += 'address,week,sat,sun,holiday,sales_remarkes,tel,remarks,'
    sql_select += 'stand_1,stand_2,stand_3,additional_information,charge_types,'
    sql_select += 'facility_information,nearby_information,supported_services,'
    sql_select += 'crowded_time_zone '
    sql_select
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
      result['detail'] = SpotDetail.new.select_all_by_id(data.detail_id.to_i)
    end
    result
  end

  def set_spot_detail_data(data)
    result_data = {}
    result_data['id'] = data['detail_id']
    result_data = SpotDetail.new.detail_info(result_data, data)
    result_data = SpotDetail.new.detail_additional(result_data, data)
    result_data = SpotDetail.new.detail_charge_types(result_data, data)
    result_data = SpotDetail.new.detail_facility(result_data, data)
    result_data = SpotDetail.new.detail_supported_services(result_data, data)
    result_data['crowded_time_zone'] = data['crowded_time_zone']
    result_data
  end

  # IDで検索
  def select_by_id(spot_id)
    Spot.where(id: spot_id)
  end
end
