class Favorite < ApplicationRecord
  belongs_to :user

  validates :place_id, presence: true,
            uniqueness: {
              scope: :user_id,
              message: "は既にお気に入り登録されています"
            }
end
