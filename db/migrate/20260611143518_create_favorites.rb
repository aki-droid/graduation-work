class CreateFavorites < ActiveRecord::Migration[7.0]
  def change
    create_table :favorites do |t|
      t.references :user, null: false, foreign_key: true
      t.string :place_id
      t.string :name
      t.string :address
      t.float :rating
      t.string :photo_reference

      t.timestamps
    end
    
    add_index :favorites, [:user_id, :place_id], unique: true
  end
end
