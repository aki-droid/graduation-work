class CreateRestaurants < ActiveRecord::Migration[7.0]
  def change
    create_table :restaurants do |t|
      t.string :name, null: false
      t.string :address
      t.string :phone
      t.text :description
      t.string :category
      t.decimal :latitude, precision: 10, scale: 6
      t.decimal :longitude, precision: 10, scale: 6
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end

    # インデックス追加
    add_index :restaurants, [:latitude, :longitude]
    add_index :restaurants, :category
  end
end
