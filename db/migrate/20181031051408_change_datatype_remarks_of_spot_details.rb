class ChangeDatatypeRemarksOfSpotDetails < ActiveRecord::Migration[5.2]
  def change
    change_column :spot_details, :sales_remarkes, :text
    change_column :spot_details, :remarks, :text
  end
end
