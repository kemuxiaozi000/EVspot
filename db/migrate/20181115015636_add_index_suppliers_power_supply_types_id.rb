class AddIndexSuppliersPowerSupplyTypesId < ActiveRecord::Migration[5.2]
  def change
    add_index :suppliers, :power_supply_types_id
  end
end
