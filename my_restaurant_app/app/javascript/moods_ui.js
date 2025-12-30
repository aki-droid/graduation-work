console.log("😊 moods_ui.js loaded");

// 気分とレストランタイプのマッピング
const moodMapping = {
  1: [ // 元気
    'restaurant',
    'cafe'
  ],

  2: [ // 疲れた
    'restaurant',
    'cafe'
  ],

  3: [ // おちこんでいる
    'cafe',
    'bakery',
    'restaurant'
  ],

  4: [ // がっつり食べたい
    'restaurant',
    'meal_takeaway'
  ],

  5: [ // 軽く済ませたい
    'meal_takeaway',
    'cafe',
    'restaurant'
  ],

  6: [ // おしゃれしたい
    'restaurant',
    'bar',
    'night_club'
  ],

  7: [ // ワイワイしたい
    'bar',
    'restaurant',
    'night_club'
  ],

  8: [ // まったりしたい
    'cafe',
    'bakery'
  ]
};

document.addEventListener('turbo:load', () => {
  const moodCards = document.querySelectorAll('.mood-card');
  const searchButton = document.getElementById('search-by-mood');

  // ページ読み込み時に保存された気分を復元
  const savedMood = localStorage.getItem('selectedMood');
  if (savedMood) {
    const savedCard = document.querySelector(`[data-mood-id="${savedMood}"]`);
    if (savedCard) {
      savedCard.classList.add('selected');
    }
  }

  // 気分カードをクリックした時の処理
  moodCards.forEach(card => {
    card.addEventListener('click', () => {
      // 他のカードの選択を解除
      moodCards.forEach(c => c.classList.remove('selected'));

      // クリックされたカードを選択状態に
      card.classList.add('selected');

      // 選択された気分のIDを取得
      const moodId = card.dataset.moodId;

      // ローカルストレージに保存
      localStorage.setItem('selectedMood', moodId);

      // 🆕 レストランタイプをローカルストレージに保存
      const restaurantTypes = moodMapping[moodId];
      localStorage.setItem('restaurantTypes', JSON.stringify(restaurantTypes));
      console.log(`😊 気分ID: ${moodId}`);
      console.log(`😊 レストランタイプ: ${restaurantTypes.join(', ')}`);

      // サーバーに送信
      fetch('/moods/select', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': document.querySelector('[name="csrf-token"]').content
        },
        body: JSON.stringify({ 
          mood_id: moodId,
          restaurant_types: restaurantTypes  // レストランタイプも送信
        })
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          console.log('✅ 気分を保存しました:', data.mood);
          console.log('✅ レストランタイプ:', restaurantTypes);
        } else {
          console.error('❌ エラー:', data.error);
        }
      })
      .catch(error => {
        console.error('❌ 通信エラー:', error);
      });
    });
  });

  // 検索ボタンをクリックした時の処理
  if (searchButton) {
    searchButton.addEventListener('click', (e) => {
      const selectedMood = localStorage.getItem('selectedMood');
      if (!selectedMood) {
        e.preventDefault();
        alert('気分を選択してください');
      } else {
        const restaurantTypes = localStorage.getItem('restaurantTypes');
        console.log('🔍 検索開始');
        console.log('😊 選択された気分:', selectedMood);
        console.log('🍽️ レストランタイプ:', restaurantTypes);
      }
    });
  }
});
