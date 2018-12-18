# frozen_string_literal: true

class PowerSupplyType < ApplicationRecord
  # 名前で検索
  # def select_by_all(s_params)
  # 名前
  # power_supply_types = name_conditions(power_supply_types, s_params)
  # end

  # 名前条件
  def name_conditions(power_supply_types, s_params)
    if s_params[:name].to_s != ''
      power_supply_types.where('name like ?', '%' + s_params[:name].to_s + '%')
    else
      power_supply_types
    end
  end

  # IDで検索
  def select_by_id(power_supply_type_id)
    PowerSupplyType.where(id: power_supply_type_id)
  end

  # IDの配列で検索する
  def select_all_by_id_arr(sup_arr)
    PowerSupplyType.where('id IN (?)', sup_arr)
  end
end
