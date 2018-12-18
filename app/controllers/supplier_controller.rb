# frozen_string_literal: true

require 'concerns/utils'

class SupplierController < ApplicationController
  include Utils
  def index
    @page_title = '供給者情報'
    supplier_id = session[:supplier_id].present? ? session[:supplier_id] : ''
    @select_supplier = supplier_id != '' ? Supplier.new.select_by_id(supplier_id) : ''

    if @select_supplier.present?
      # supplier名称は5文字以上の場合、3文字+"…"とする
      name = @select_supplier[0].name
      if name.length > 4
        edited_name = name.slice(0, 3)
        edited_name += '…'
        @select_supplier[0]['name'] = edited_name
      end
      @select_supplier_photo = get_photo(@select_supplier[0])
      @select_supplier_electric_photo = get_electric_photo(@select_supplier[0])
    end

    # ログ取得
    Userlog.new.insert(session[:user_name].to_s, 'supplier', nil, params.to_s)
  end
end
