class AddUserIdToRestaurants < ActiveRecord::Migration[7.0]
  def change
    unless column_exists?(:restaurants, :user_id)
      add_reference :restaurants, :user, foreign_key: true
    end
  end
end
