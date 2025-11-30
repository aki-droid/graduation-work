console.log('location.js loaded');

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded - location.js');

  const getLocationBtn = document.getElementById('get-location-btn');

  if (getLocationBtn) {
    console.log('位置情報取得ボタンが見つかりました');
    getLocationBtn.addEventListener('click', getCurrentLocation);
  }
});

function getCurrentLocation() {
  console.log('getCurrentLocation called');

  const btn = document.getElementById('get-location-btn');
  const loading = document.getElementById('location-loading');
  const info = document.getElementById('location-info');
  const error = document.getElementById('location-error');

  info.style.display = 'none';
  error.style.display = 'none';
  loading.style.display = 'block';
  btn.disabled = true;

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
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;
  const accuracy = position.coords.accuracy;

  console.log('位置情報取得成功:', { latitude, longitude, accuracy });

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

  // 🔥 Stimulus(map_controller) に即時通知
  window.dispatchEvent(new CustomEvent("location:updated", {
    detail: { latitude, longitude }
  }));

  console.log("📡 map_controller へ座標送信完了");

  // ✅ ページリロードは不要なので削除
}

function onError(error) {
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
