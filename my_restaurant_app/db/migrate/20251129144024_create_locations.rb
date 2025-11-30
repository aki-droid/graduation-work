class CreateLocations < ActiveRecord::Migration[7.0]
  def change
    create_table :locations do |t|
      t.decimal :latitude, precision: 10, scale: 8, null: false, comment: '緯度'
      t.decimal :longitude, precision: 11, scale: 8, null: false, comment: '経度'
      t.float :accuracy, comment: '精度（メートル）'
      t.bigint :user_id, comment: 'ユーザーID'

      t.timestamps
    end

    # インデックスを追加（将来のパフォーマンス向上のため）
    add_index :locations, :user_id
    add_index :locations, :created_at
  end
end
