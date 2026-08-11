class AddLocationToRestaurants < ActiveRecord::Migration[7.0]
  def change
    unless column_exists?(:restaurants, :latitude)
      add_column :restaurants, :latitude, :decimal
    end

    unless column_exists?(:restaurants, :longitude)
      add_column :restaurants, :longitude, :decimal
    end
  end
end
