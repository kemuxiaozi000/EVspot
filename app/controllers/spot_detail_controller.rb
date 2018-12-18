# frozen_string_literal: true

class SpotDetailController < ApplicationController
  def index
    @page_title = 'スポット詳細'
    # スポット詳細
    @spot_id = params[:spot_id]
    @coupon = Spot.new.select_coupon_by_id(@spot_id)

    # ログ取得
    Userlog.new.insert(session[:user_name].to_s, 'spot_detail', nil, params.to_s)
  end
end
