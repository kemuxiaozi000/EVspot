# frozen_string_literal: true

class PowerSupplyTypesController < ApplicationController
  def index
    @page_title = '電気を選ぶ - これからEVドライブ'

    # ログ取得
    Userlog.new.insert(session[:user_name].to_s, 'power_supply_types', nil, params.to_s)
  end
end
