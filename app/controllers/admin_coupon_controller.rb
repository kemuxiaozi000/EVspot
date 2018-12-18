class AdminCouponController < ApplicationController
  before_action :admin_login_check

  def index
    @page_title = 'クーポン管理画面'
    @coupons = Coupon.all.order(:id)

    # ログ取得
    Userlog.new.insert(session[:user_name].to_s, 'admin_coupon', nil, params.to_s)
  end
end
