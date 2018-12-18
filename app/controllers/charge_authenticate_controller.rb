# frozen_string_literal: true

class ChargeAuthenticateController < ApplicationController
  def index
    @page_title = '充電認証完了'
    session[:temporary_spot_id] = params[:spot_id]
    @spot_name = Spot.find_by(id: params[:spot_id])&.name
    # ログ取得
    Userlog.new.insert(session[:user_name].to_s, 'charge_authenticate', nil, params.to_s)
  end
end
