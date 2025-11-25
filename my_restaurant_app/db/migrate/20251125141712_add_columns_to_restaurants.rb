class AddColumnsToRestaurants < ActiveRecord::Migration[7.0]
  def change
    add_column :restaurants, :address, :string
    add_column :restaurants, :phone, :string
    add_column :restaurants, :description, :text
    add_column :restaurants, :category, :string
    add_column :restaurants, :latitude, :decimal, precision: 10, scale: 6
    add_column :restaurants, :longitude, :decimal, precision: 10, scale: 6
    
    # まずnull許可でuser_idカラムを追加
    add_reference :restaurants, :user, null: true, foreign_key: true
    
    # 既存レコードにデフォルトユーザーを設定
    reversible do |dir|
      dir.up do
        if Restaurant.exists?
          # 既存の最初のユーザーを取得（ID: 1のユーザー）
          default_user = User.first
          
          if default_user
            # 既存のRestaurantレコードにuser_idを設定
            Restaurant.where(user_id: nil).update_all(user_id: default_user.id)
            puts "✅ Updated #{Restaurant.where(user_id: default_user.id).count} restaurants with user: #{default_user.email}"
          end
        end
      end
    end
    
    # NOT NULL制約を追加
    change_column_null :restaurants, :user_id, false
    
    # インデックス追加
    add_index :restaurants, [:latitude, :longitude]
    add_index :restaurants, :category
  end
end
