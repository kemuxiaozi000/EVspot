class AddNewColumnToSuppliers < ActiveRecord::Migration[5.2]
  def change
    add_column :suppliers, :producing_area, :string
    add_column :suppliers, :origin, :string
  end
end
