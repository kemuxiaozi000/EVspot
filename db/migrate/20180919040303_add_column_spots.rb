class AddColumnSpots < ActiveRecord::Migration[5.2]
  def change
    add_column :spots, :detail_id, :integer
  end
end
