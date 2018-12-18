# frozen_string_literal: true

class SupplierSample3Controller < ApplicationController
  def index
    @page_title = '供給者情報サンプル3'

    # ログ取得
    Userlog.new.insert(session[:user_name].to_s, 'supplier_sample3', nil, params.to_s)
  end
end
