# frozen_string_literal: true

class SuppliersEditController < ApplicationController
  def index
    @page_title = '供給者管理画面'
    @suppliers = Supplier.all.order(:id)

    # ログ取得
    Userlog.new.insert(session[:user_name].to_s, 'supplier_edit', nil, params.to_s)
  end
end
