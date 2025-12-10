console.log("😊 moods_ui.js loaded");
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
      
      // サーバーに送信
      fetch('/moods/select', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': document.querySelector('[name="csrf-token"]').content
        },
        body: JSON.stringify({ mood_id: moodId })
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          console.log('気分を保存しました:', data.mood);
        } else {
          console.error('エラー:', data.error);
        }
      })
      .catch(error => {
        console.error('通信エラー:', error);
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
      }
    });
  }
});
