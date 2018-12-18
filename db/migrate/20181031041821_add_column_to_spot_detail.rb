class AddColumnToSpotDetail < ActiveRecord::Migration[5.2]
  def change
    add_column :spot_details, :stand_1, :string
    add_column :spot_details, :stand_2, :string
    add_column :spot_details, :stand_3, :string
  end
end
