# frozen_string_literal: true

class Api::Management::AdminUserLogController < ApplicationController
  before_action :admin_login_check
  protect_from_forgery except: :index

  def index
    maxdate = params[:max_date]
    maxdate = maxdate.to_date + 1 unless maxdate.blank?

    @filter_params = {
      min_date: params[:min_date],
      max_date: maxdate,
      user_name: params[:user_name]
    }
    @pageno = (params[:pageno].to_i - 1) * 30

    @user_logs = Userlog.new.select_by_all_s(@filter_params, @pageno)
    @max_page = (Userlog.new.select_by_all(@filter_params).size.to_f / 30).ceil
    result = {
      user_logs: @user_logs,
      page: @max_page
    }
    render json: result
  end
end
