class CreateReserves < ActiveRecord::Migration[5.2]
  def change
    create_table :reserves do |t|
      t.datetime :datetime
      t.date :from_date
      t.date :to_date
      t.integer :spot_id
      t.integer :status

      t.timestamps
    end
  end
end
