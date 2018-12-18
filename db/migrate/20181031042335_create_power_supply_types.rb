class CreatePowerSupplyTypes < ActiveRecord::Migration[5.2]
  def change
    create_table :power_supply_types do |t|
      t.string :name

      t.timestamps
    end
  end
end
