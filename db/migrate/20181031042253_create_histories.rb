class CreateHistories < ActiveRecord::Migration[5.2]
  def change
    create_table :histories do |t|
      t.datetime :datetime
      t.string :spot_id
      t.string :volume
      t.integer :price

      t.timestamps
    end
  end
end
