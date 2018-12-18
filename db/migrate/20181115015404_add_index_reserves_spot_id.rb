class AddIndexReservesSpotId < ActiveRecord::Migration[5.2]
  def change
    add_index :reserves, :spot_id
  end
end
