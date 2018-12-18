require 'date'
require 'time'

class Userlog < ApplicationRecord
  # 時間,名前,画面名,アクション,条件を登録
  def insert(user_name, screen, action, parameter)
    datetime = Time.zone.now.in_time_zone('Asia/Tokyo')
    todaysdate = Time.new(datetime.year, datetime.mon, datetime.day, datetime.hour, datetime.min, datetime.sec)
    Userlog.create(datetime: todaysdate, user_name: user_name, screen: screen, action: action, parametar: parameter)
  end
end
