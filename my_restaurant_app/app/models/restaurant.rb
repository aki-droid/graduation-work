class Restaurant < ApplicationRecord
  belongs_to :user

  validates :name, presence: true, length: { maximum: 100 }
  
  # latitude/longitudeは任意項目に変更（allow_nil: true追加）
  validates :latitude, 
    numericality: { 
      greater_than_or_equal_to: -90, 
      less_than_or_equal_to: 90 
    }, 
    allow_nil: true  # ← 追加
    
  validates :longitude, 
    numericality: { 
      greater_than_or_equal_to: -180, 
      less_than_or_equal_to: 180 
    }, 
    allow_nil: true  # ← 追加
    
  validates :category, inclusion: {
    in: %w[和食 洋食 中華 イタリアン フレンチ カフェ ファストフード その他]
  }
end
