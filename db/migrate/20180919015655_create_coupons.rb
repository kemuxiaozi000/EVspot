class CreateCoupons < ActiveRecord::Migration[5.2]
  def change
    create_table :coupons do |t|
      t.string :title
      t.string :message
      t.date :from_date
      t.date :to_date

      t.timestamps
    end
  end
end
