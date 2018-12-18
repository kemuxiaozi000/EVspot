# frozen_string_literal: true

class Api::Supplierlist::SupplierselectController < ApplicationController
  protect_from_forgery except: :index
  @user_name = ''
  def index
    Userlog.new.insert(session[:user_name], 'supplier', 'supplier選択処理', params.to_s)

    session[:supplier_id] = params[:supplier_id]
    session[:supplier_name] = params[:supplier_name]
    render json: 0
  end
end
