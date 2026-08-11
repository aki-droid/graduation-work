console.log('✅ map.js が読み込まれました');

// ========================================
// 地図表示コントローラー
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  const mapElements = document.querySelectorAll('[data-controller="map"]');
  
  if (mapElements.length === 0) {
    console.log('ℹ️ 地図要素が見つかりません');
    return;
  }

  // Google Maps APIが読み込まれるまで待機
  if (typeof google === 'undefined' || typeof google.maps === 'undefined') {
    console.warn('⚠️ Google Maps APIが読み込まれていません');
    return;
  }

  mapElements.forEach(element => {
    const latitude = parseFloat(element.dataset.mapLatitudeValue);
    const longitude = parseFloat(element.dataset.mapLongitudeValue);
    const name = element.dataset.mapNameValue || '店舗';

    console.log('🗺️ 地図を初期化:', { latitude, longitude, name });

    // 地図の初期化
    const map = new google.maps.Map(element, {
      center: { lat: latitude, lng: longitude },
      zoom: 15,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
    });

    // マーカーの設置
    const marker = new google.maps.Marker({
      position: { lat: latitude, lng: longitude },
      map: map,
      title: name,
      animation: google.maps.Animation.DROP,
    });

    // 情報ウィンドウ
    const infoWindow = new google.maps.InfoWindow({
      content: `<div style="padding: 10px;"><strong>${name}</strong></div>`
    });

    // マーカークリックで情報表示
    marker.addListener('click', () => {
      infoWindow.open(map, marker);
    });

    console.log('✅ 地図の初期化完了');
  });
});
