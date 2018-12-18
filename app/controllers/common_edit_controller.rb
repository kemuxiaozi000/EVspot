# frozen_string_literal: true

class CommonEditController < ApplicationController
  def index
    @page_title = '共通管理'
    @commonlist = Common.all
    # ログ取得
    Userlog.new.insert(session[:user_name].to_s, 'common_edit', nil, params.to_s)
  end
end
