class QrreaderController < ApplicationController
  def index
    @page_title = 'QRコード認証'

    # ログ取得
    Userlog.new.insert(session[:user_name].to_s, 'qrreader', nil, params.to_s)
  end
end
