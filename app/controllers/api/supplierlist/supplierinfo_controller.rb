# frozen_string_literal: true

class Api::Supplierlist::SupplierinfoController < ApplicationController
  protect_from_forgery except: :index

  def index
    Userlog.new.insert(session[:user_name], 'supplier', '絞り込み処理', params.to_s)

    @result = Supplier.new.select_by_all(params)
    render json: @result
  end
end
