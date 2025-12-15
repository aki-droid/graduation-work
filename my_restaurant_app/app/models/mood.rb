class Mood
  MOODS = [
    {
      id: 1,
      name: '元気な気分',
      icon: '😊',
      category: 'カジュアル',
      restaurant_categories: ['カジュアル', '和食', '定食'],  # ⭐ 追加
      google_types: ['restaurant', 'cafe']
    },
    {
      id: 2,
      name: 'がっつり食べたい',
      icon: '🍜',
      category: 'ボリューム系',
      restaurant_categories: ['ラーメン', '焼肉', '定食', '丼もの'],  # ⭐ 追加
      google_types: ['meal_takeaway', 'restaurant']
    },
    {
      id: 3,
      name: 'まったりしたい',
      icon: '☕',
      category: 'カフェ系',
      restaurant_categories: ['カフェ', 'スイーツ', 'バー'],  # ⭐ 追加
      google_types: ['cafe', 'bakery']
    },
    {
      id: 4,
      name: 'おしゃれしたい',
      icon: '🍷',
      category: '高級店',
      restaurant_categories: ['フレンチ', 'イタリアン', '高級和食', 'バー'],  # ⭐ 追加
      google_types: ['bar', 'night_club', 'restaurant']
    },
    {
      id: 5,
      name: '軽く済ませたい',
      icon: '🍕',
      category: 'ファストフード',
      restaurant_categories: ['ファストフード', 'カフェ', 'テイクアウト'],  # ⭐ 追加
      google_types: ['meal_takeaway', 'cafe']
    },
    {
      id: 6,
      name: 'おちこんでいる時',
      icon: '😢',
      category: '癒し系',
      restaurant_categories: ['カフェ', 'スイーツ', 'ラーメン', '定食'],
      google_types: ['cafe', 'bakery', 'restaurant']
    }
  ].freeze

  def self.all
    MOODS
  end

  def self.find(id)
    MOODS.find { |mood| mood[:id] == id.to_i }
  end

  # ⭐ 気分に対応するレストランカテゴリを取得(DB検索用)
  def self.restaurant_categories_for(mood_id)
    mood = find(mood_id)
    mood ? mood[:restaurant_categories] : []
  end

  # ⭐ 気分に対応するGoogle Places APIのタイプを取得
  def self.google_types_for(mood_id)
    mood = find(mood_id)
    mood ? mood[:google_types] : ['restaurant']
  end
end
