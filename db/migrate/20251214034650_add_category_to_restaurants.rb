class AddCategoryToRestaurants < ActiveRecord::Migration[7.0]
  def change
    unless column_exists?(:restaurants, :category)
      add_column :restaurants, :category, :string
    end
  end
end
