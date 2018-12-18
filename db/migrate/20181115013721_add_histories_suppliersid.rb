class AddHistoriesSuppliersid < ActiveRecord::Migration[5.2]
  def change
    add_column :histories,:supplier_id,:integer
  end
end
