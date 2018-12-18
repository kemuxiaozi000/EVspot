# frozen_string_literal: true

class Supplier < ApplicationRecord
  # 電源種別,名前,産地,由来,価格で検索
  def select_by_all(s_params)
    # id=0(default設定値)以外を全て取得
    suppliers = Supplier.where.not(id: 0)
    # 発電者
    suppliers = generator_conditions(suppliers, s_params)
    # 発電種別
    suppliers = origin_conditions(suppliers, s_params)
    # 発電場所
    suppliers = producing_area_conditions(suppliers, s_params)
    # 価格
    suppliers = price_max_conditions(suppliers, s_params)
    suppliers
  end

  # 発電者による絞り込み
  def generator_conditions(suppliers, s_params)
    generators = []
    # 個人=[松原,畠山,広井,三宅,母校,井上,鈴木,伊藤,小野]
    if s_params[:personal_energy]&.to_s == 'on'
      generators.push('松原', '畠山', '広井', '三宅', '母校',
                      '井上', '鈴木', '伊藤', '小野')
    end
    # 有名人=[NGE]
    generators.push('NGE') if s_params[:famous_energy]&.to_s == 'on'
    # 新電力=[町内電力（株）,地元エネルギー（株）,渋谷パワー（株）,赤城エネルギー（株）,
    # 気仙沼サンサンエナジー（株）,宮城エネルギア（株）,飛騨電力（株）,新穂高パワー（株）,
    # カルデラ発電（株）,黒霧パワー（株）,ウィンド新潟（株）,宇和島ウィングス（株）]
    if s_params[:newpower_energy]&.to_s == 'on'
      generators.push('町内電力（株）', '地元エネルギー（株）', '渋谷パワー（株）', '赤城エネルギー（株）',
                      '気仙沼サンサンエナジー(株）', '宮城エネルギア（株）', '飛騨電力（株）', '新穂高パワー（株）',
                      'カルデラ発電（株）', '黒霧パワー（株）', 'ウィンド新潟（株）', '宇和島ウィングス（株）')
    end
    # 大手=[中部電力（株）,東京電力（株）,関西電力（株）,九州電力（株）]
    generators.push('中部電力（株）', '東京電力（株）', '関西電力（株）', '九州電力（株）') if s_params[:major_energy]&.to_s == 'on'
    suppliers = suppliers.where(name: generators) unless generators.empty?
    suppliers
  end

  # 発電種別による絞り込み
  def origin_conditions(suppliers, s_params)
    origins = []
    # 自然エネルギー=[太陽光,地熱,風力,水力]
    origins.push('太陽光', '地熱', '風力', '水力') if s_params[:natural_energy]&.to_s == 'on'
    # 火力=[火力]
    origins.push('火力') if s_params[:thermal_power]&.to_s == 'on'
    # 原子力=[原子力]
    origins.push('原子力') if s_params[:nuclear_power]&.to_s == 'on'
    suppliers = suppliers.where(origin: origins) unless origins.empty?
    suppliers
  end

  # 発電場所による絞り込み
  def producing_area_conditions(suppliers, s_params)
    producing_area = []
    # 地元応援
    producing_area.push('岐阜県可児市') if s_params[:love_local]&.to_s == 'on'
    # 復興支援
    producing_area.push('宮城県気仙沼市') if s_params[:reconstruction_support]&.to_s == 'on'
    # 母校応援
    producing_area.push('愛知県小牧市') if s_params[:graduate_school]&.to_s == 'on'
    # 旅行記念
    producing_area.push('岐阜県高山市') if s_params[:travel_memory]&.to_s == 'on'
    # その他
    if s_params[:other_area]&.to_s == 'on'
      producing_area.push('愛知県名古屋市', '群馬県前橋市', '東京都港区', '東京都渋谷区',
                          '熊本県熊本市', '鹿児島県霧島市', '新潟県新潟市', '愛媛県宇和島市',
                          '岐阜県美濃市', '新潟県鶴岡市', '兵庫県姫路市', '佐賀県玄海市',
                          '静岡県御前崎市')
    end
    suppliers = suppliers.where(producing_area: producing_area) unless producing_area.empty?
    suppliers
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
