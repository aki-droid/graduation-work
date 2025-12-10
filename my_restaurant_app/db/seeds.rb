user = User.find_by(email: "test2@example.com")

if user.nil?
  puts "❌ test2@example.com のユーザーが見つかりません"
  exit
end

puts "✅ User found: #{user.email}"

# 栃木駅周辺のレストランデータ
restaurants_data = [
  {
    name: "栃木駅前レストラン",
    address: "栃木県栃木市万町1-1",
    phone: "0282-23-1234",
    description: "栃木駅から徒歩3分の和食レストラン",
    category: "和食",
    latitude: 36.3825,
    longitude: 139.7339,
    user_id: user.id
  },
  {
    name: "栃木市役所近くのカフェ",
    address: "栃木県栃木市万町9-25",
    phone: "0282-23-5678",
    description: "市役所近くの落ち着いたカフェ",
    category: "カフェ",
    latitude: 36.3817,
    longitude: 139.7356,
    user_id: user.id
  },
  {
    name: "蔵の街イタリアン",
    address: "栃木県栃木市嘉右衛門町1-1",
    phone: "0282-23-9012",
    description: "蔵の街観光エリアのおしゃれなイタリアン",
    category: "イタリアン",
    latitude: 36.3795,
    longitude: 139.7325,
    user_id: user.id
  },
  {
    name: "栃木駅前ラーメン",
    address: "栃木県栃木市万町2-1",
    phone: "0282-23-1111",
    description: "地元で人気のラーメン店",
    category: "ラーメン",
    latitude: 36.3830,
    longitude: 139.7345,
    user_id: user.id
  },
  {
    name: "駅南口居酒屋",
    address: "栃木県栃木市万町3-5",
    phone: "0282-23-2222",
    description: "駅近の居酒屋",
    category: "居酒屋",
    latitude: 36.3820,
    longitude: 139.7335,
    user_id: user.id
  }
]

# データを登録
restaurants_data.each do |data|
  Restaurant.find_or_create_by!(name: data[:name]) do |restaurant|
    restaurant.assign_attributes(data)
  end
end

puts "Seed完了: #{Restaurant.count}件のレストランを登録しました"
