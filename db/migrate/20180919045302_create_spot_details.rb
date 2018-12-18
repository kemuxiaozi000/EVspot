class CreateSpotDetails < ActiveRecord::Migration[5.2]
  def change
    create_table :spot_details do |t|
      t.string :address
      t.string :week
      t.string :sat
      t.string :sun
      t.string :holiday
      t.string :sales_remarkes
      t.string :tel
      t.string :remarks

      t.timestamps
    end
  end
end
