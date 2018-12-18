# frozen_string_literal: true

require 'date'
require 'time'

class UserbaseController < ApplicationController
  def index
    @page_title = 'ホーム'
    # ログ取得
    datetime = Time.zone.now.in_time_zone('Asia/Tokyo')
    todaysdate = Time.new(datetime.year, datetime.mon, datetime.day, datetime.hour, datetime.min, datetime.sec)
    !session[:user_name].present? ? session[:user_name] = todaysdate.to_s : nil
    Userlog.new.insert(session[:user_name].to_s, 'home', nil, params.to_s)
  end
end
