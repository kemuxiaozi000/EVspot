# frozen_string_literal: true

class SupplierController < ApplicationController
  def index
    @page_title = '供給者情報 - これからEVドライブ'
    @pst_id = params[:power_supply_type_id]

    # ログ取得
    Userlog.new.insert(session[:user_name].to_s, 'supplier', nil, params.to_s)
  end
end
