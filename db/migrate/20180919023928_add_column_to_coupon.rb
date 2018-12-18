class AddColumnToCoupon < ActiveRecord::Migration[5.2]
  def change
    add_column :coupons, :lat, :float,:limit => 53
    add_column :coupons, :lon, :float,:limit => 53
  end
end
