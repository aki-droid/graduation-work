console.log('location.js loaded');

// DOM読み込み完了後に実行
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded - location.js');

  const getLocationBtn = document.getElementById('get-location-btn');

  if (getLocationBtn) {
    console.log('位置情報取得ボタンが見つかりました');
    getLocationBtn.addEventListener('click', getCurrentLocation);
  }
});

/**
 * 現在地を取得する
 */
function getCurrentLocation() {
  console.log('getCurrentLocation called');

  // 各要素を取得
  const btn = document.getElementById('get-location-btn');
  const loading = document.getElementById('location-loading');
  const info = document.getElementById('location-info');
  const error = document.getElementById('location-error');

  // 表示をリセット
  info.style.display = 'none';
  error.style.display = 'none';
  loading.style.display = 'block';
  btn.disabled = true;

  // Geolocation APIのサポート確認
  if (!navigator.geolocation) {
    console.error('Geolocation APIがサポートされていません');
    showError('お使いのブラウザは位置情報取得に対応していません');
    return;
  }

  console.log('位置情報取得を開始します');

  // オプション設定
  const options = {
    enableHighAccuracy: true,  // 高精度モード
    timeout: 10000,            // タイムアウト: 10秒
    maximumAge: 0              // キャッシュを使用しない
  };

  // 位置情報を取得
  navigator.geolocation.getCurrentPosition(
    onSuccess,   // 成功時
    onError,     // 失敗時
    options
  );
}

/**
 * 位置情報取得成功時の処理
 */
function onSuccess(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;
  const accuracy = position.coords.accuracy;

  console.log('位置情報取得成功:', { latitude, longitude, accuracy });

  // UI更新
  const btn = document.getElementById('get-location-btn');
  const loading = document.getElementById('location-loading');
  const info = document.getElementById('location-info');

  loading.style.display = 'none';
  info.style.display = 'block';
  btn.disabled = false;
  btn.innerHTML = '<i class="fas fa-sync-alt me-2"></i>再取得';

  // 位置情報を表示
  document.getElementById('latitude').textContent = latitude.toFixed(6);
  document.getElementById('longitude').textContent = longitude.toFixed(6);
  document.getElementById('accuracy').textContent = Math.round(accuracy);
}

/**
 * 位置情報取得失敗時の処理
 */
function onError(error) {
  console.error('位置情報取得エラー:', error);

  let message = '';

  switch(error.code) {
    case error.PERMISSION_DENIED:
      message = '位置情報の利用が許可されていません。ブラウザの設定を確認してください。';
      break;
    case error.POSITION_UNAVAILABLE:
      message = '位置情報を取得できませんでした。もう一度お試しください。';
      break;
    case error.TIMEOUT:
      message = '位置情報の取得がタイムアウトしました。もう一度お試しください。';
      break;
    default:
      message = '不明なエラーが発生しました。';
  }

  showError(message);
}

/**
 * エラーメッセージを表示
 */
function showError(message) {
  const btn = document.getElementById('get-location-btn');
  const loading = document.getElementById('location-loading');
  const error = document.getElementById('location-error');
  const errorMessage = document.getElementById('error-message');

  loading.style.display = 'none';
  error.style.display = 'block';
  errorMessage.textContent = message;
  btn.disabled = false;
}

console.log('📍 Location.js loaded successfully!');
