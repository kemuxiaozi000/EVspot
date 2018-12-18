# frozen_string_literal: true

class SuppliersEditController < ApplicationController
  before_action :admin_login_check

  def index
    @page_title = '供給者管理画面'
    @suppliers = Supplier.all.order(:id)
    @power_supply = PowerSupplyType.all.order(:id)
  end
end
