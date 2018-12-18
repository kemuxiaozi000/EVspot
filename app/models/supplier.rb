# frozen_string_literal: true

class Supplier < ApplicationRecord
  # IDで検索
  def select_by_id(supplier_id)
    Supplier.where(id: supplier_id)
  end

  # IDの配列で検索する
  def select_all_by_id_arr(sup_arr)
    Supplier.where('id IN (?)', sup_arr)
  end
end
