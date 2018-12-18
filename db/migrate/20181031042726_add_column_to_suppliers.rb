class AddColumnToSuppliers < ActiveRecord::Migration[5.2]
  def change
    add_column :suppliers, :power_supply_types_id, :integer
  end
end
