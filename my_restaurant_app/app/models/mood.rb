class Mood
  MOODS = [
    { id: 1, name: '元気な気分', icon: '😊', category: 'カジュアル' },
    { id: 2, name: 'がっつり食べたい', icon: '🍜', category: 'ボリューム系' },
    { id: 3, name: 'まったりしたい', icon: '☕', category: 'カフェ系' },
    { id: 4, name: 'おしゃれしたい', icon: '🍷', category: '高級店' },
    { id: 5, name: '軽く済ませたい', icon: '🍕', category: 'ファストフード' }
  ].freeze

  def self.all
    MOODS
  end

  def self.find(id)
    MOODS.find { |mood| mood[:id] == id.to_i }
  end
end
