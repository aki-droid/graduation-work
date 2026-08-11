class Location < ApplicationRecord
  # バリデーション
  validates :latitude, presence: true, 
                       numericality: { greater_than_or_equal_to: -90, 
                                       less_than_or_equal_to: 90 }
  validates :longitude, presence: true, 
                        numericality: { greater_than_or_equal_to: -180, 
                                        less_than_or_equal_to: 180 }
  validates :accuracy, numericality: { greater_than: 0 }, allow_nil: true

  # 将来の拡張用: ユーザーとの関連付け
  # belongs_to :user, optional: true
end
