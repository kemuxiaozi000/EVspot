class AddIndexSpotsCouponIdSupplierId < ActiveRecord::Migration[5.2]
  def change
    add_index :spots, :coupon_id
    add_index :spots, :supplier_id
  end
end
