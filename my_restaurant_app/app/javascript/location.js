console.log('📍 location.js loaded');

// ======== 二重実行を防ぐフラグ ========
let locationInitialized = false;

// Turboのページ遷移時に必ず再初期化できるようフラグを戻す
document.addEventListener("turbo:before-render", () => {
  console.log("♻️ turbo:before-render → locationInitialized を false に戻します");
  locationInitialized = false;
});

// ========================================
// 初期化
// ========================================
function initializeLocation() {
  if (locationInitialized) {
    console.log("⏭️ 位置情報機能は既に初期化済みのためスキップ");
    return;
  }
  locationInitialized = true;

  console.log('🔄 位置情報機能の初期化を開始');

  // 登録ページのボタン
  const getLocationBtn = document.getElementById('get-location-btn');

  // 検索ページのボタン
  const getCurrentLocationBtn = document.getElementById('getCurrentLocation');

  // 登録ページの処理
  if (getLocationBtn) {
    console.log('✅ 位置情報取得ボタンが見つかりました(登録ページ)');
    getLocationBtn.addEventListener('click', getCurrentLocation);
  }

  // 検索ページの処理
  if (getCurrentLocationBtn) {
    console.log('✅ 現在地から検索ボタンが見つかりました(検索ページ)');
    getCurrentLocationBtn.addEventListener('click', searchByCurrentLocation);
  }

  console.log('✅ 位置情報機能の初期化完了');
}

// Turboページ遷移＆通常読み込みの両方で実行
document.addEventListener('turbo:load', initializeLocation);
document.addEventListener('DOMContentLoaded', initializeLocation);

// ========================================
// 以下はあなたが書いた処理（変更なし）
// ========================================

function getCurrentLocation() {
  console.log('📍 getCurrentLocation called');

  const btn = document.getElementById('get-location-btn');
  const loading = document.getElementById('location-loading');
  const info = document.getElementById('location-info');
  const error = document.getElementById('location-error');

  info.style.display = 'none';
  error.style.display = 'none';
  loading.style.display = 'block';
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>取得中...';

  if (!navigator.geolocation) {
    showError('お使いのブラウザは位置情報取得に対応していません');
    return;
  }

  navigator.geolocation.getCurrentPosition(onSuccess, onError, {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 0
  });
}

function onSuccess(position) {
  const { latitude, longitude, accuracy } = position.coords;

  console.log('✅ 位置情報取得成功:', { latitude, longitude, accuracy });

  localStorage.setItem('user_latitude', latitude);
  localStorage.setItem('user_longitude', longitude);
  console.log('💾 座標をlocalStorageに保存しました');

  const btn = document.getElementById('get-location-btn');
  const loading = document.getElementById('location-loading');
  const info = document.getElementById('location-info');

  loading.style.display = 'none';
  info.style.display = 'block';
  btn.disabled = false;
  btn.innerHTML = '<i class="fas fa-sync-alt me-2"></i>再取得';

  document.getElementById('latitude').textContent = latitude.toFixed(6);
  document.getElementById('longitude').textContent = longitude.toFixed(6);
  document.getElementById('accuracy').textContent = Math.round(accuracy);

  window.dispatchEvent(new CustomEvent("location:updated", {
    detail: { latitude, longitude }
  }));

  console.log("📡 map_controllerへ座標送信完了");
}

function onError(error) {
  console.error('❌ 位置情報取得エラー:', error);

  let message = {
    [error.PERMISSION_DENIED]: '位置情報の利用が許可されていません。ブラウザの設定を確認してください。',
    [error.POSITION_UNAVAILABLE]: '位置情報を取得できませんでした。',
    [error.TIMEOUT]: '位置情報の取得がタイムアウトしました。'
  }[error.code] || '不明なエラーが発生しました。';

  showError(message);
}

function showError(message) {
  const btn = document.getElementById('get-location-btn');
  const loading = document.getElementById('location-loading');
  const error = document.getElementById('location-error');
  const errorMessage = document.getElementById('error-message');

  loading.style.display = 'none';
  error.style.display = 'block';
  errorMessage.textContent = message;
  btn.disabled = false;
  btn.innerHTML = '<i class="fas fa-crosshairs me-2"></i>現在地を取得';
}

// --- 検索ページ（変更なし） ---
function searchByCurrentLocation() {
  console.log('🔍 searchByCurrentLocation called');
  
  const btn = document.getElementById('getCurrentLocation');
  
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>位置情報を取得中...';

  if (!navigator.geolocation) {
    alert('お使いのブラウザは位置情報に対応していません。');
    resetSearchButton();
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords;

      console.log('✅ 検索用位置情報取得成功:', { latitude, longitude });

      document.getElementById('latitude').value = latitude;
      document.getElementById('longitude').value = longitude;

      document.getElementById('searchForm').submit();
    },
    (e) => {
      console.error('❌ 位置情報取得エラー:', e);

      let msg = {
        [e.PERMISSION_DENIED]: '位置情報の取得が拒否されました。',
        [e.POSITION_UNAVAILABLE]: '位置情報が利用できません。',
        [e.TIMEOUT]: '位置情報の取得がタイムアウトしました。'
      }[e.code] || '位置情報の取得に失敗しました。';

      alert(msg);
      resetSearchButton();
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    }
  );
}

function resetSearchButton() {
  const btn = document.getElementById('getCurrentLocation');
  if (btn) {
    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-location-arrow me-2"></i>現在地から検索';
  }
}
