require 'date'
require 'time'

class Userlog < ApplicationRecord
  # 時間,名前,画面名,アクション,条件を登録
  def insert(user_name, screen, action, parameter)
    datetime = Time.zone.now.in_time_zone('Asia/Tokyo')
    todaysdate = Time.new(datetime.year, datetime.mon, datetime.day, datetime.hour, datetime.min, datetime.sec)
    Userlog.create(datetime: todaysdate, user_name: user_name, screen: screen, action: action, parametar: parameter)
  end

  def select_by_id(user_log_id)
    Userlog.where(id: user_log_id)
  end

  # 絞り込み条件で検索
  def select_by_all(s_params)
    userlogs = Userlog.all
    userlogs = min_date_conditions(userlogs, s_params)
    userlogs = max_date_conditions(userlogs, s_params)
    userlogs = user_name_conditions(userlogs, s_params)
    userlogs
  end

  # 絞り込み条件で検索(30件絞り込み)
  def select_by_all_s(s_params, page)
    userlogs = Userlog.all
    userlogs = min_date_conditions(userlogs, s_params)
    userlogs = max_date_conditions(userlogs, s_params)
    userlogs = user_name_conditions(userlogs, s_params)
    userlogs = userlogs[page..page + 29]
    userlogs
  end

  # 期間min条件
  def min_date_conditions(userlogs, s_params)
    if (s_params[:min_date]).present?
      userlogs.where('datetime >= ?', s_params[:min_date].to_date)
    else
      userlogs
    end
  end

  # 期間max条件
  def max_date_conditions(userlogs, s_params)
    if (s_params[:max_date]).present?
      userlogs.where('datetime <= ?', s_params[:max_date].to_date)
    else
      userlogs
    end
  end

  # ユーザ名条件
  def user_name_conditions(userlogs, s_params)
    if s_params[:user_name].to_s != ''
      userlogs.where('user_name like ?', '%' + s_params[:user_name].to_s + '%')
    else
      userlogs
    end
  end
end
