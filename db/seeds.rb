user = User.find_or_create_by!(email: 'test2@example.com') do |u|
  u.password = 'password'
  u.password_confirmation = 'password'
end
puts "✅ User found or created: #{user.email}"

restaurants_data = [
  {
    name: "栃木駅前レストラン",
    address: "栃木県栃木市万町1-1",
    phone: "0282-23-1234",
    description: "栃木駅から徒歩3分の和食レストラン",
    category: "和食",
    latitude: 36.3825,
    longitude: 139.7339,
    mood: "1"
  },
  {
    name: "栃木イタリアンダイニング",
    address: "栃木県栃木市境町1-1",
    phone: "0282-23-5678",
    description: "本格イタリアンが楽しめるお店",
    category: "イタリアン",
    latitude: 36.3850,
    longitude: 139.7350,
    mood: "2"
  },
  {
    name: "栃木カフェテラス",
    address: "栃木県栃木市室町1-1",
    phone: "0282-23-9999",
    description: "落ち着いた雰囲気のカフェ",
    category: "カフェ",
    latitude: 36.3875,
    longitude: 139.7360,
    mood: "3"
  },
  {
    name: "栃木中華料理",
    address: "栃木県栃木市倭町1-1",
    phone: "0282-23-1111",
    description: "本格中華が楽しめるお店",
    category: "中華",
    latitude: 36.3800,
    longitude: 139.7320,
    mood: "1"
  },
  {
    name: "栃木フレンチビストロ",
    address: "栃木県栃木市泉町1-1",
    phone: "0282-23-2222",
    description: "気軽に楽しめるフレンチ",
    category: "フレンチ",
    latitude: 36.3900,
    longitude: 139.7370,
    mood: "2"
  }
]

Restaurant.destroy_all

restaurants_data.each do |data|
  # geocodeを無効化してレストランを作成
  restaurant = Restaurant.new(data)
  restaurant.save(validate: false)  # バリデーションをスキップしてgeocodeを実行しない
end

puts "✅ Seed完了: #{restaurants_data.size}件のレストランを登録しました"
