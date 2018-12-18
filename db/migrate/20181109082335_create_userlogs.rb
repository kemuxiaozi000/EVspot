class CreateUserlogs < ActiveRecord::Migration[5.2]
  def change
    create_table :userlogs do |t|
      t.datetime :datetime
      t.string :user_name
      t.string :screen
      t.string :action
      t.string :parametar

      t.timestamps
    end
  end
end
