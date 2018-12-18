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
    # 供給者IDは1～9をランダムで登録する
    supplier_id = rand(1..9)
    Spot.create(name: row[0], lat: row[1], lon:row[2], supplier_id: supplier_id,detail_id:row[3])
  end
end

# Spot_detail
# ActiveRecord::Base.connection.execute('TRUNCATE TABLE `spot_details`')
if SpotDetail.count.zero?
  CSV.foreach('db/gogoevspotdetail.csv') do |row|
    SpotDetail.create(address: row[0], week: row[1], sat: row[2], sun: row[3], holiday: row[4], sales_remarkes: row[5], tel: row[6], remarks: row[7], stand_1: row[8], stand_2: row[9], stand_3: row[10])
  end
end

# Suppliers
# ActiveRecord::Base.connection.execute('TRUNCATE TABLE `suppliers`')
if Supplier.count.zero?
  CSV.foreach('db/suppliers.csv') do |row|
    Supplier.create(name: row[1], value: row[2], power_supply_types_id: row[3], producing_area: row[4], origin: row[5])
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
if History.count.zero?
  CSV.foreach('db/history.csv') do |row|
    History.create(datetime: row[1], spot_id: row[2], volume: row[3], price: row[4])
  end
end

# power_supply_types
ActiveRecord::Base.connection.execute('TRUNCATE TABLE `power_supply_types`')
if PowerSupplyType.count.zero?
  CSV.foreach('db/power_supply_types.csv') do |row|
    PowerSupplyType.create(id: row[0], name: row[1])
  end
end

# Common
# ActiveRecord::Base.connection.execute('TRUNCATE TABLE `common`')
if Common.count.zero?
  CSV.foreach('db/common.csv') do |row|
    Common.create(name: row[1], value: row[2])
  end
end
