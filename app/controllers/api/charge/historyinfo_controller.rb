# frozen_string_literal: true

class Api::Charge::HistoryinfoController < ApplicationController
  protect_from_forgery except: :index
  require 'date'
  def index
    Userlog.new.insert(session[:user_name], 'charge_status', '明細登録処理', params.to_s)
    # 時間（分）
    time = params[:time]
    # 充電スポットID
    spot_id = params[:spot_id]
    # 供給者ID
    supplier_id = session[:supplier_id] || 0
    supplier_data = Supplier.new.select_by_id(supplier_id)
    # 明細の登録
    new_history = History.new.create_by_time(time, spot_id, supplier_id, supplier_data[0].value)

    # 登録後のIDを返却
    render json: new_history.id
  end
end
