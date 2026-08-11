class AddMoodToRestaurants < ActiveRecord::Migration[7.0]
  def change
    add_column :restaurants, :mood, :string
  end
end
