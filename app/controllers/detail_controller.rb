# frozen_string_literal: true

class DetailController < ApplicationController
  def index
    @page_title = '詳細画面'
    # クーポンID
    coupon_id = params[:coupon_id].to_i
    # スポットID
    spot_id = params[:spot_id].to_i.zero? ? Spot.new.select_all_by_couponid(coupon_id) : params[:spot_id].to_i
    @spot_id = spot_id
    # 提供者ID（空許容）
    @supplier_id = params[:supplier_id].to_i

    # ログ取得
    Userlog.new.insert(session[:user_name].to_s, 'detail', nil, params.to_s)
  end
end
