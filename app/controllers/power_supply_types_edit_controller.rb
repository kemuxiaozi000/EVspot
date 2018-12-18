class PowerSupplyTypesEditController < ApplicationController
  before_action :admin_login_check

  def index
    @page_title = '電源種別管理画面'
    @power_supply_types = PowerSupplyType.all.order(:id)

    # ログ取得
    Userlog.new.insert(session[:user_name].to_s, 'power_supply_types_edit', nil, params.to_s)
  end
end
