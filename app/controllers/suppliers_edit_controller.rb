# frozen_string_literal: true

class SuppliersEditController < ApplicationController
  def index
    @page_title = '供給者管理画面'
    @suppliers = Supplier.all.order(:id)
  end
end
