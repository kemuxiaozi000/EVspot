# frozen_string_literal: true

class CouponController < ApplicationController
  def index
    @page_title = 'クーポン画面 - これからEVドライブ'
    # スポットID
    @spot_id = params[:spot_id].to_i

    # ログ取得
    Userlog.new.insert(session[:user_name].to_s, 'coupon', nil, params.to_s)
  end
end
