console.log('📍 location.js loaded');

// 🔥 Turbo対応: DOMContentLoadedとturbo:loadの両方で初期化
document.addEventListener('DOMContentLoaded', initializeLocation);
document.addEventListener('turbo:load', initializeLocation);

function initializeLocation() {
  console.log('🔄 位置情報機能の初期化を開始');

  const getLocationBtn = document.getElementById('get-location-btn');

  // ボタンが存在しない場合は処理を中断(エラーではなく情報ログ)
  if (!getLocationBtn) {
    console.log('ℹ️ このページには位置情報取得ボタンがありません(正常)');
    return;
  }

  console.log('✅ 位置情報取得ボタンが見つかりました');

  // 既存のイベントリスナーを削除してから新しく設定(重複防止)
  const newBtn = getLocationBtn.cloneNode(true);
  getLocationBtn.parentNode.replaceChild(newBtn, getLocationBtn);

  // クリックイベントを設定
  newBtn.addEventListener('click', getCurrentLocation);

  console.log('✅ 位置情報機能の初期化完了');
}

function getCurrentLocation() {
  console.log('📍 getCurrentLocation called');

  const btn = document.getElementById('get-location-btn');
  const loading = document.getElementById('location-loading');
  const info = document.getElementById('location-info');
  const error = document.getElementById('location-error');

  // UI状態をリセット
  info.style.display = 'none';
  error.style.display = 'none';
  loading.style.display = 'block';
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>取得中...';

  // Geolocation APIのサポート確認
  if (!navigator.geolocation) {
    showError('お使いのブラウザは位置情報取得に対応していません');
    return;
  }

  // 位置情報を取得
  navigator.geolocation.getCurrentPosition(onSuccess, onError, {
    enableHighAccuracy: true,  // 高精度モード
    timeout: 10000,            // 10秒でタイムアウト
    maximumAge: 0              // キャッシュを使わない
  });
}

function onSuccess(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;
  const accuracy = position.coords.accuracy;

  console.log('✅ 位置情報取得成功:', { latitude, longitude, accuracy });

  // localStorageに保存
  localStorage.setItem('user_latitude', latitude);
  localStorage.setItem('user_longitude', longitude);
  console.log('💾 座標をlocalStorageに保存しました');

  const btn = document.getElementById('get-location-btn');
  const loading = document.getElementById('location-loading');
  const info = document.getElementById('location-info');

  // UI更新
  loading.style.display = 'none';
  info.style.display = 'block';
  btn.disabled = false;
  btn.innerHTML = '<i class="fas fa-sync-alt me-2"></i>再取得';

  // 座標を表示
  document.getElementById('latitude').textContent = latitude.toFixed(6);
  document.getElementById('longitude').textContent = longitude.toFixed(6);
  document.getElementById('accuracy').textContent = Math.round(accuracy);

  // Stimulus(map_controller)に通知
  window.dispatchEvent(new CustomEvent("location:updated", {
    detail: { latitude, longitude }
  }));

  console.log("📡 map_controllerへ座標送信完了");
}

function onError(error) {
  console.error('❌ 位置情報取得エラー:', error);

  let message = '';
  switch(error.code) {
    case error.PERMISSION_DENIED:
      message = '位置情報の利用が許可されていません。ブラウザの設定を確認してください。';
      console.error('位置情報の許可が拒否されました');
      break;
    case error.POSITION_UNAVAILABLE:
      message = '位置情報を取得できませんでした。もう一度お試しください。';
      console.error('位置情報が利用できません');
      break;
    case error.TIMEOUT:
      message = '位置情報の取得がタイムアウトしました。もう一度お試しください。';
      console.error('位置情報取得がタイムアウトしました');
      break;
    default:
      message = '不明なエラーが発生しました。';
      console.error('不明なエラー');
  }
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

console.log('✅ Location.js loaded successfully!');
