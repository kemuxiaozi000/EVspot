# frozen_string_literal: true

require 'concerns/utils'

class Api::Couponlist::CouponinfoController < ApplicationController
  include Utils

  protect_from_forgery except: :index
  def index
    Userlog.new.insert(session[:user_name], 'coupon', 'クーポン情報取得処理', params.to_s)
    # スポットID
    spot_id = params[:spot_id].to_i
    spot_data = Spot.new.select_by_id(spot_id) if spot_id.present?
    @result = nil
    @result = Coupon.new.select_all_by_id_arr(devide_string(spot_data[0].coupon_id.to_s, ':')) if spot_id.present?
    render json: @result
  end
end
