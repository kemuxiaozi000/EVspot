# frozen_string_literal: true

require 'concerns/utils'

class Coupon < ApplicationRecord
  include Utils

  def select_all_by_id_arr(coupon_arr)
    Coupon.where('id IN (?)', coupon_arr)
  end

  # クーポン情報を開始日付が新しい順ですべて取得
  def select_all_in_date_order(todaysdate)
    Coupon.where('to_date >= ?', todaysdate)
          .where('from_date <= ?', todaysdate)
          .order('from_date DESC')
  end

  def select_by_id(coupon_id)
    Coupon.where(id: coupon_id)
  end

  # 緯度経度から付近のクーポン情報を新しい順で取得
  def select_all_by_latlon(current_lat, current_lon, todaysdate)
    latlon_arr = get_latlon_rad(current_lat, current_lon, 5000)
    Coupon.where(lat: latlon_arr[0]..latlon_arr[1])
          .where(lon: latlon_arr[2]..latlon_arr[3])
          .where('to_date >= ?', todaysdate)
          .where('from_date <= ?', todaysdate)
          .order('from_date DESC')
  end
end
