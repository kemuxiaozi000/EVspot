# frozen_string_literal: true

class Api::Supplierlist::SupplierinfoController < ApplicationController
  protect_from_forgery except: :index

  def index
    Userlog.new.insert(session[:user_name], 'supplier', '絞り込み処理', params.to_s)
    @supplier_params = {
      # 電源種別（必須）
      power_supply_type_id: params[:power_supply_type_id],
      # 名前（空許容）
      name: params[:name],
      # 価格（空許容）
      price_min: params[:price_min],
      price_max: params[:price_max],
      # 産地（空許容）
      production_area: params[:production_area],
      # 由来（空許容）
      origin: params[:origin]
    }
    @result = Supplier.new.select_by_all(@supplier_params)
    render json: @result
  end
end
