class AddColumnPhotoCommentToSuppliers < ActiveRecord::Migration[5.2]
  def change
    add_column :suppliers, :photo, :string
    add_column :suppliers, :comment, :string
    add_column :suppliers, :thanks_comment, :string
  end
end
