# frozen_string_literal: true

class CouponController < ApplicationController
  def index
    @page_title = 'クーポン画面'
    # スポットID
    @spot_id = params[:spot_id].to_i
    # スポット名
    @spot_info = nil
    @spot_info = Spot.new.select_by_id(@spot_id) if params[:spot_id].to_i.present?

    # ログ取得
    Userlog.new.insert(session[:user_name].to_s, 'coupon', nil, params.to_s)
  end
end
