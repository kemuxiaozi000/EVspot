class ChangeDatatypeParametarOfUserlogs < ActiveRecord::Migration[5.2]
  def change
    change_column :userlogs, :parametar, :text
  end
end
