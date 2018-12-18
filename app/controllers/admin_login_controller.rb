class AdminLoginController < ApplicationController
  def index
    @page_title = '管理者ログイン画面'
    redirect_to('/suppliers_edit') if session[:administrator_key] == 'mzyy2_wypX-Qaf42VVxR'
  end

  def login
    if params[:admin_login_id] == 'kevdadmin' && params[:password] == 'admin'
      session[:administrator_key] = 'mzyy2_wypX-Qaf42VVxR'
      redirect_to('/suppliers_edit')
    else
      @page_title = '管理者ログイン画面'
      render('admin_login/index')
    end
  end
end
