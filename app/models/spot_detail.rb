# frozen_string_literal: true

require 'concerns/utils'

class SpotDetail < ApplicationRecord
  include Utils

  # IDで検索
  def select_by_id(detail_id)
    SpotDetail.where(id: detail_id)
  end

  # IDで詳細情報検索
  def select_all_by_id(detail_id)
    spotdetail_data = SpotDetail.where(id: detail_id)
    data_input(spotdetail_data)
  end

  # 詳細情報設定
  def data_input(spotdetail_data)
    arr = []
    spotdetail_data.each do |data|
      result_data = {}
      result_data['id'] = data['id']
      result_data['address'] = data['address']
      result_data['week'] = data['week']
      result_data['sat'] = data['sat']
      result_data['sun'] = data['sun']
      result_data['holiday'] = data['holiday']
      result_data['sales_remarkes'] = data['sales_remarkes']
      result_data['tel'] = data['tel']
      result_data['remarks'] = data['remarks']
      result_data = detail_additional(result_data, data)
      result_data = detail_charge_types(result_data, data)
      result_data = detail_facility(result_data, data)
      result_data = detail_supported_services(result_data, data)
      result_data['crowded_time_zone'] = data['crowded_time_zone']
      arr.push(result_data)
    end
    arr
  end

  def detail_additional(result_data, data)
    result_data['toilet'] = data['additional_information'].to_s.include?('トイレ') ? 1 : 0
    result_data['smoking_area'] = data['additional_information'].to_s.include?('喫煙所') ? 1 : 0
    result_data
  end

  def detail_charge_types(result_data, data)
    result_data['stand_1'] = data['stand_1']
    result_data['stand_2'] = data['stand_2']
    result_data['stand_3'] = data['stand_3']
    result_data['rapid_charge'] = data['charge_types'].to_s.include?('急速充電') ? 1 : 0
    result_data['normal_charge'] = data['charge_types'].to_s.include?('普通充電') ? 1 : 0
    result_data
  end

  def detail_facility(result_data, data)
    result_data['cafe'] = data['facility_information'].to_s.include?('カフェ') ? 1 : 0
    result_data['restaurant'] = data['facility_information'].to_s.include?('レストラン') ? 1 : 0
    result_data['shopping'] = data['facility_information'].to_s.include?('ショッピング') ? 1 : 0
    result_data['play_space'] = data['facility_information'].to_s.include?('遊び場') ? 1 : 0
    result_data['nursing_room'] = data['facility_information'].to_s.include?('授乳室') ? 1 : 0
    result_data['sightseeing'] = data['nearby_information']
    result_data
  end

  def detail_supported_services(result_data, data)
    result_data['ncs'] = data['supported_services'].to_s.include?('NCS') ? 1 : 0
    result_data['zesp2'] = data['supported_services'].to_s.include?('ZESP2') ? 1 : 0
    result_data['other_services'] = data['supported_services'].to_s.include?('その他充電サービス') ? 1 : 0
    result_data
  end

  # 検索条件で検索
  def get_spot_detail_condition_sql(spot_detail_search_params)
    sql = ''
    sql = get_spot_detail_condition(sql, 'additional_information', 'トイレ', spot_detail_search_params[:toilet])
    sql = get_spot_detail_condition(sql, 'additional_information', '喫煙所', spot_detail_search_params[:smoking_area])
    sql = get_spot_detail_condition(sql, 'charge_types', '急速充電', spot_detail_search_params[:rapid_charge])
    sql = get_spot_detail_condition(sql, 'charge_types', '普通充電', spot_detail_search_params[:normal_charge])
    sql = get_spot_detail_condition(sql, 'facility_information', 'カフェ', spot_detail_search_params[:cafe])
    sql = get_spot_detail_condition(sql, 'facility_information', 'レストラン', spot_detail_search_params[:restaurant])
    sql = get_spot_detail_condition(sql, 'facility_information', 'ショッピング', spot_detail_search_params[:shopping])
    sql = get_spot_detail_condition(sql, 'facility_information', '遊び場', spot_detail_search_params[:play_space])
    sql = get_spot_detail_condition(sql, 'facility_information', '授乳室', spot_detail_search_params[:nursing_room])
    sql = get_spot_detail_nearby_condition(sql, spot_detail_search_params[:sightseeing])
    sql = get_coupon_condition(sql, spot_detail_search_params[:coupon])
    sql = 'and 1 = 1 ' unless sql.present?
    sql
  end

  def get_spot_detail_condition(sql, column_name, param_name, search_param)
    sql += 'and ' + column_name + ' like "%' + param_name + '%" ' if search_param == 'on'
    sql
  end

  def get_spot_detail_nearby_condition(sql, search_param)
    sql += 'and nearby_information is not null ' if search_param == 'on'
    sql
  end

  def get_coupon_condition(sql, search_param)
    sql += 'and coupon_id is not null ' if search_param == 'on'
    sql
  end
end
