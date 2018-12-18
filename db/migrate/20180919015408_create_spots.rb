class CreateSpots < ActiveRecord::Migration[5.2]
  def change
    create_table :spots do |t|
      t.string :name
      t.float :lat,:limit => 53
      t.float :lon,:limit => 53
      t.string :coupon_id
      t.string :supplier_id

      t.timestamps
    end
  end
end
