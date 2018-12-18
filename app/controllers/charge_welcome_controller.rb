# frozen_string_literal: true

class ChargeWelcomeController < ApplicationController
  def index
    @page_title = '認証完了'
    spot_id = params[:spot_id].present? ? params[:spot_id] : session[:temporary_spot_id]
    @spot_name = Spot.find_by(id: spot_id)&.name
    session[:temporary_spot_id] = !session[:temporary_spot_id].present? ? params[:spot_id] : session[:temporary_spot_id]
    # ログ取得
    Userlog.new.insert(session[:user_name].to_s, 'charge_welcome', nil, params.to_s)
  end
end
