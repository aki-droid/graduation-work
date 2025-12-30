class Restaurant < ApplicationRecord
  # belongs_to :user

  geocoded_by :address
  after_validation :geocode, if: :address_changed?

  validates :name, presence: true, length: { maximum: 100 }

  validates :latitude,
    numericality: {
      greater_than_or_equal_to: -90,
      less_than_or_equal_to: 90
    },
    allow_nil: true

  validates :longitude,
    numericality: {
      greater_than_or_equal_to: -180,
      less_than_or_equal_to: 180
    },
    allow_nil: true

  validates :category, inclusion: {
    in: %w[和食 洋食 中華 イタリアン フレンチ カフェ ファストフード ラーメン 居酒屋 その他]
  }, allow_nil: true

  scope :near_location, ->(latitude, longitude, distance_in_km = 5) {
    near([latitude, longitude], distance_in_km, units: :km, order: false)
  }

  def distance_from(latitude, longitude)
    return nil unless self.latitude && self.longitude

    Geocoder::Calculations.distance_between(
      [latitude, longitude],
      [self.latitude, self.longitude],
      units: :km
    ).round(2)
  end
end
