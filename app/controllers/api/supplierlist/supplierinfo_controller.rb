# frozen_string_literal: true

require 'concerns/utils'

class Api::Supplierlist::SupplierinfoController < ApplicationController
  include Utils
  protect_from_forgery except: :index

  def index
    Userlog.new.insert(session[:user_name], 'supplier', '絞り込み処理', params.to_s)

    suppliers = Supplier.new.select_by_all(params)
    @result = supplier_data_set(suppliers)
    render json: @result
  end

  # 発電種別による絞り込み
  def supplier_data_set(suppliers)
    supplier_list = []
    suppliers.each do |data|
      result_data = {}
      result_data['id'] = data['id']
      # supplier名称は5文字以上の場合、3文字+"…"とする
      if data['name'].length > 4
        edited_name = data['name'].slice(0, 3) + '…'
        data['name'] = edited_name
      end
      result_data['name'] = data['name']
      result_data['value'] = data['value']
      result_data['power_supply_types_id'] = data['power_supply_types_id']
      result_data['producing_area'] = data['producing_area']
      result_data['origin'] = data['origin']
      result_data['photo'] = get_photo(data)
      result_data['electric_photo'] = get_electric_photo(data)
      result_data['comment'] = data['comment']
      result_data['thanks_comment'] = data['thanks_comment']
      supplier_list.push(result_data)
    end
    supplier_list
  end
end
