class AddIndexHistoriesSpotId < ActiveRecord::Migration[5.2]
  def change
    add_index :histories, :spot_id
  end
end
