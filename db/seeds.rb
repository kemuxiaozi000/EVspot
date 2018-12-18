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
ActiveRecord::Base.connection.execute('TRUNCATE TABLE `spots`')
if Spot.count.zero?
  CSV.foreach('db/spots.csv') do |row|
    Spot.create(name: row[1], lat: row[2], lon:row[3], coupon_id:row[4], supplier_id:row[5], detail_id:row[8])
  end
end

# Spot_detail
ActiveRecord::Base.connection.execute('TRUNCATE TABLE `spot_details`')
if SpotDetail.count.zero?
  CSV.foreach('db/spot_details.csv') do |row|
    SpotDetail.create(address: row[1], week: row[2], sat:row[3], sun:row[4], holiday:row[5], sales_remarkes:row[6], tel:row[7], remarks:row[8])
  end
end

# Supplires
ActiveRecord::Base.connection.execute('TRUNCATE TABLE `suppliers`')
if Supplier.count.zero?
  CSV.foreach('db/suppliers.csv') do |row|
    Supplier.create(name: row[1], value: row[2])
  end
end

# Supplires
ActiveRecord::Base.connection.execute('TRUNCATE TABLE `coupons`')
if Coupon.count.zero?
  CSV.foreach('db/coupons.csv') do |row|
    Coupon.create(title: row[1], message: row[2], from_date: row[3], to_date: row[4], lat: row[7], lon: row[8])
  end
end

# Members
ActiveRecord::Base.connection.execute('TRUNCATE TABLE `members`')
if Member.count.zero?
  CSV.foreach('db/member.csv') do |row|
    Member.create(email_address: row[1], password: row[2])
  end
end
