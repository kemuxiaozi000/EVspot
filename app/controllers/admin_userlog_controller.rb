class AdminUserlogController < ApplicationController
  before_action :admin_login_check

  def index
    @page_title = 'ユーザーログ管理画面'
    # @user_logs = Userlog.all.order(:id)
    @user_name = Userlog.select(:user_name).where('user_name IS NOT NULL').distinct.order('user_name')

    @filter_params = {
      min_date: params[:min_date],
      max_date: params[:max_date],
      user_name: params[:user_name]
    }
    @user_logs = Userlog.new.select_by_all(@filter_params)

    respond_to do |format|
      format.html
      format.csv do
        send_data render_to_string, filename: 'admin_userlog.csv', type: :csv
      end
    end
    @page = 1
    user_logs_count = @user_logs.count
    @user_logs = @user_logs.limit(30)
    @last = (user_logs_count.to_f / 30).ceil
  end
end
