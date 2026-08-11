console.log("😊 moods_ui.js loaded");

// 気分とレストランタイプのマッピング
const moodMapping = {
  1: ['restaurant', 'cafe'],
  2: ['restaurant', 'cafe'],
  3: ['cafe', 'bakery', 'restaurant'],
  4: ['restaurant', 'meal_takeaway'],
  5: ['meal_takeaway', 'cafe', 'restaurant'],
  6: ['restaurant', 'bar', 'night_club'],
  7: ['bar', 'restaurant', 'night_club'],
  8: ['cafe', 'bakery']
};

// Turbo二重バインド防止
let initialized = false;

function initMoodUI() {
  if (initialized) return;
  initialized = true;

  const moodCards = document.querySelectorAll('.mood-card');
  const searchButton = document.getElementById('search-button'); // ★修正ここ

  console.log("initMoodUI:", moodCards.length);

  // ページ読み込み時に保存された気分を復元
  const savedMood = localStorage.getItem('selectedMood');
  if (savedMood) {
    const savedCard = document.querySelector(`[data-mood-id="${savedMood}"]`);
    if (savedCard) {
      savedCard.classList.add('selected');
    }
  }

  // 気分カードクリック
  moodCards.forEach(card => {
    card.addEventListener('click', () => {

      moodCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');

      const moodId = Number(card.dataset.moodId); // ★修正（重要）

      localStorage.setItem('selectedMood', moodId);

      const restaurantTypes = moodMapping[moodId] || [];
      localStorage.setItem('restaurantTypes', JSON.stringify(restaurantTypes));

      console.log('😊 気分ID:', moodId);
      console.log('🍽️ レストランタイプ:', restaurantTypes);

      fetch('/moods/select', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': document.querySelector('[name="csrf-token"]')?.content
        },
        body: JSON.stringify({
          mood_id: moodId,
          restaurant_types: restaurantTypes
        })
      })
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          console.log('✅ 保存成功');
        } else {
          console.error('❌ エラー:', data.error);
        }
      })
      .catch(err => console.error('❌ 通信エラー:', err));
    });
  });

  // 検索ボタン
  if (searchButton) {
    searchButton.addEventListener('click', (e) => {
      const selectedMood = localStorage.getItem('selectedMood');

      if (!selectedMood) {
        e.preventDefault();
        alert('気分を選択してください');
        return;
      }

      const restaurantTypes = localStorage.getItem('restaurantTypes');

      console.log('🔍 検索開始');
      console.log('😊 気分:', selectedMood);
      console.log('🍽️ タイプ:', restaurantTypes);
    });
  }
}

// Turbo対応 + 初回ロード対応
document.addEventListener('DOMContentLoaded', initMoodUI);
document.addEventListener('turbo:load', initMoodUI);
