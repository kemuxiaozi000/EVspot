# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

# coding: utf-8
require 'csv'

# Spot
# ActiveRecord::Base.connection.execute('TRUNCATE TABLE `spots`')
if Spot.count.zero?
  CSV.foreach('db/gogoevspot.csv') do |row|
    # 各spotに0～3個のクーポンIDを付ける
    coupon = nil
    coupon_amount = rand(0..3)

    # 11/18 インタビュー用設定
    case row[0]
    when  '中日本高速道路(株) NEXCO中日本 名神高速道路 養老SA (上り)',
          '中日本高速道路(株) NEXCO中日本 名神高速道路 養老SA (下り)'
      coupon_amount = 0
    when  '中日本高速道路(株) NEXCO中日本 名神高速道路 多賀SA (上り)',
          '中日本高速道路(株) NEXCO中日本 名神高速道路 多賀SA (下り)',
          '中日本高速道路(株) NEXCO中日本 名神高速道路 尾張一宮PA (上り)',
          '中日本高速道路(株) NEXCO中日本 名神高速道路 尾張一宮PA (下り)'
      coupon_amount = 3
    end

    if (coupon_amount > 0)
      coupon = (1..6).to_a.shuffle![0..(coupon_amount -1)].sort.join(':')
    end

    # 供給者IDは1～5をランダムで登録する
    supplier_id = rand(1..5)

    Spot.create(name: row[0], lat: row[1], lon:row[2], coupon_id: coupon, supplier_id: supplier_id, detail_id:row[3])
  end
end

# Spot_detail
# ActiveRecord::Base.connection.execute('TRUNCATE TABLE `spot_details`')
if SpotDetail.count.zero?
  # 付帯情報のパターン(レコードごとにランダムで登録)
  additional_info = [nil, 'トイレ', '喫煙所', 'トイレ:喫煙所']
  # 機器種別のパターン(レコードごとにランダムで登録)
  charge_types = ['急速充電', '普通充電', '急速充電:普通充電']
  # 店舗情報のパターン(レコードごとにランダムで登録)
  facility_info = [nil, 'カフェ', 'レストラン', 'カフェ:ショッピング', 'カフェ:遊び場', 'カフェ:授乳室', 'カフェ:レストラン:ショッピング:遊び場:授乳室']
  # 周辺情報のパターン(レコードごとにランダムで登録)
  nearby_info = [nil, nil, nil, '徒歩10分圏', '徒歩5分圏']
  # 対象サービスのパターン(レコードごとにランダムで登録)
  supported_services = ['NCS', 'ZESP2', 'NCS:ZESP2', 'その他充電サービス', 'NCS:ZESP2:その他充電サービス']
  # 混雑時間帯のパターン(レコードごとにランダムで登録)
  crowded_time_zone = [nil, nil, '11:00～13:00', '17:00～20:00', '11:00～13:00、17:00～19:00']
  CSV.foreach('db/gogoevspotdetail.csv') do |row|
    SpotDetail.create(address: row[0], week: row[1], sat: row[2], sun: row[3], holiday: row[4],
       sales_remarkes: row[5], tel: row[6], remarks: row[7], stand_1: row[8], stand_2: row[9], stand_3: row[10],
       additional_information: additional_info[rand(0..(additional_info.length - 1))],
       charge_types: charge_types[rand(0..(charge_types.length - 1))],
       facility_information: facility_info[rand(0..(facility_info.length - 1))],
       nearby_information: nearby_info[rand(0..nearby_info.length - 1)],
       supported_services: supported_services[rand(0..supported_services.length - 1)],
       crowded_time_zone: crowded_time_zone[rand(0..crowded_time_zone.length - 1)])
  end
end

# Suppliers
ActiveRecord::Base.connection.execute('TRUNCATE TABLE `suppliers`')
if Supplier.count.zero?
  CSV.foreach('db/suppliers.csv') do |row|
    Supplier.create(id: row[0], name: row[1], value: row[2], power_supply_types_id: row[3], producing_area: row[4], origin: row[5], photo: row[6], comment: row[7], thanks_comment: row[8])
  end
end

# Coupons
# ActiveRecord::Base.connection.execute('TRUNCATE TABLE `coupons`')
if Coupon.count.zero?
  CSV.foreach('db/coupons.csv') do |row|
    Coupon.create(title: row[1], message: row[2], from_date: row[3], to_date: row[4], lat: row[7], lon: row[8])
  end
end

# Members
# ActiveRecord::Base.connection.execute('TRUNCATE TABLE `members`')
if Member.count.zero?
  CSV.foreach('db/member.csv') do |row|
    Member.create(email_address: row[1], password: row[2])
  end
end

# Histories
# ActiveRecord::Base.connection.execute('TRUNCATE TABLE `histories`')
# if History.count.zero?
#   CSV.foreach('db/history.csv') do |row|
#     History.create(datetime: row[1], spot_id: row[2], volume: row[3], price: row[4],supplier_id: row[5])
#   end
# end

# power_supply_types
ActiveRecord::Base.connection.execute('TRUNCATE TABLE `power_supply_types`')
if PowerSupplyType.count.zero?
  CSV.foreach('db/power_supply_types.csv') do |row|
    PowerSupplyType.create(id: row[0], name: row[1])
  end
end

# Common
# ActiveRecord::Base.connection.execute('TRUNCATE TABLE `commons`')
if Common.count.zero?
  CSV.foreach('db/common.csv') do |row|
    Common.create(id: row[0], name: row[1], value: row[2])
  end
end
