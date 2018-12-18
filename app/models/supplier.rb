# frozen_string_literal: true

class Supplier < ApplicationRecord
  # 電源種別,名前,産地,由来,価格で検索
  def select_by_all(s_params)
    # id=0(default設定値)以外を全て取得
    suppliers = Supplier.where.not(id: 0)
    # 発電者
    # 生産者は私 = 写真あり
    suppliers = suppliers.where.not(photo: nil) if s_params[:supplier_me]&.to_s == 'on'
    # 電源種別
    suppliers = power_supply_types_conditions(suppliers, s_params)
    # 発電場所
    suppliers = produciton_conditions(suppliers, s_params)
    # 価格
    suppliers = price_min_conditions(suppliers, s_params)
    suppliers = price_max_conditions(suppliers, s_params)
    suppliers
  end

  # 電源種別
  def power_supply_types_conditions(suppliers, s_params)
    power_supply_types_id = []
    # 自然エネルギー=0
    power_supply_types_id.push(0) if s_params[:natural_energy]&.to_s == 'on'
    # 火力=1
    power_supply_types_id.push(1) if s_params[:thermal_power]&.to_s == 'on'
    suppliers = suppliers.where(power_supply_types_id: power_supply_types_id) unless power_supply_types_id.empty?
    suppliers
  end

  # 産地条件
  def produciton_conditions(suppliers, s_params)
    # 発電場所
    producing_area = []
    # 地元愛
    producing_area.push('愛知県瀬戸市') if s_params[:love_local]&.to_s == 'on'
    # 復興支援
    producing_area.push('宮城県気仙沼市') if s_params[:reconstruction_support]&.to_s == 'on'
    # その他
    producing_area.push('愛知県名古屋市') if s_params[:other_area]&.to_s == 'on'
    suppliers = suppliers.where(producing_area: producing_area) unless producing_area.empty?
    suppliers
  end

  # 最低価格条件
  def price_min_conditions(suppliers, s_params)
    if s_params[:price_min]&.to_i != 0
      suppliers.where('value >= ?', s_params[:price_min]&.to_i)
    else
      suppliers
    end
  end

  # 最大価格条件
  def price_max_conditions(suppliers, s_params)
    if s_params[:price_max]&.to_i != 0
      suppliers.where('value <= ?', s_params[:price_max]&.to_i)
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
