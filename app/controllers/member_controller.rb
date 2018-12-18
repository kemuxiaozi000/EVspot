# frozen_string_literal: true

class MemberController < ApplicationController
  def index
    @page_title = '会員登録'

    # ログ取得
    Userlog.new.insert(session[:user_name].to_s, 'member', nil, params.to_s)
  end
end
