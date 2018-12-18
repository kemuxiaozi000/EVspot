# frozen_string_literal: true

class WaitingtimeController < ApplicationController
  before_action :admin_login_check

  def index
    @page_title = '待ち時間管理'
    id = 1
    @waitingtime = Common.new.select_by_id(id)

    # ログ取得
    Userlog.new.insert(session[:user_name].to_s, 'waitingtime', nil, params.to_s)
  end
end
