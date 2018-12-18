# frozen_string_literal: true

class SupplierDetailController < ApplicationController
  def index
    @page_title = '供給者情報詳細'

    # 指定されたIDの供給者情報を取得
    @supplier_detail = Supplier.new.select_by_id(params[:supplier_id])

    # ログ取得
    Userlog.new.insert(session[:user_name].to_s, 'supplier_detail', nil, params.to_s)
  end
end
