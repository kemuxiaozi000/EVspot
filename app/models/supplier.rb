# frozen_string_literal: true

class Supplier < ApplicationRecord
  # 電源種別,名前,産地,由来,価格で検索
  def select_by_all(s_params)
    # 電源種別
    suppliers = Supplier.where(power_supply_types_id: s_params[:power_supply_type_id])
    # 名前
    suppliers = name_conditions(suppliers, s_params)
    # 産地
    suppliers = produciton_conditions(suppliers, s_params)
    # 由来
    suppliers = name_conditions(suppliers, s_params)
    # 価格
    suppliers = price_min_conditions(suppliers, s_params)
    suppliers = price_max_conditions(suppliers, s_params)
    suppliers
  end

  # 名前条件
  def name_conditions(suppliers, s_params)
    if s_params[:name].to_s != ''
      suppliers.where('name like ?', '%' + s_params[:name].to_s + '%')
    else
      suppliers
    end
  end

  # 産地条件
  def produciton_conditions(suppliers, s_params)
    if s_params[:production_area].to_s != ''
      suppliers.where('producing_area like ?', '%' + s_params[:production_area].to_s + '%')
    else
      suppliers
    end
  end

  # 由来条件
  def origin_conditions(suppliers, s_params)
    if s_params[:v].to_s != ''
      suppliers.where('origin like ?', '%' + s_params[:origin].to_s + '%')
    else
      suppliers
    end
  end

  # 最低価格条件
  def price_min_conditions(suppliers, s_params)
    if s_params[:price_min].to_i != 0
      suppliers.where('value >= ?', s_params[:price_min].to_i)
    else
      suppliers
    end
  end

  # 最大価格条件
  def price_max_conditions(suppliers, s_params)
    if s_params[:price_max].to_i != 0
      suppliers.where('value <= ?', s_params[:price_max].to_i)
    else
      suppliers
    end
  end

  # IDで検索
  def select_by_id(supplier_id)
    Supplier.where(id: supplier_id)
  end

  # IDの配列で検索する
  def select_all_by_id_arr(sup_arr)
    Supplier.where('id IN (?)', sup_arr)
  end

  # 電源種別を取得する
  def select_pst_by_id(id_arr)
    Supplier.joins('INNER JOIN power_supply_types ON suppliers.power_supply_types_id = power_supply_types.id')
            .select('suppliers.*, power_supply_types.name as pst_name')
            .where('suppliers.id IN (?)', id_arr)
  end
end
