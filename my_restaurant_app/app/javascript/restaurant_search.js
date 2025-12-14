console.log('✅ restaurant_search.js が読み込まれました');

// ========================================
// レストラン検索関数(Places API New版)
// ========================================
export async function searchRestaurants(latitude, longitude, restaurantTypes = ['restaurant']) {
  console.log('🔍 レストラン検索開始');

  // ★★★ 数値型に変換 ★★★
  const lat = typeof latitude === 'number' ? latitude : parseFloat(latitude);
  const lng = typeof longitude === 'number' ? longitude : parseFloat(longitude);

  console.log('📍 緯度:', lat, '(型:', typeof lat, ')');
  console.log('📍 経度:', lng, '(型:', typeof lng, ')');
  console.log('🍽️ レストランタイプ:', restaurantTypes);

  // バリデーション
  if (isNaN(lat) || isNaN(lng)) {
    console.error('❌ 座標が不正:', { latitude, longitude });
    throw new Error('緯度・経度が正しく取得できませんでした');
  }

  // ★★★ centerオブジェクトを作成 ★★★
  const center = {
    latitude: lat,
    longitude: lng
  };

  console.log('🎯 検索中心座標:', center);

  const { Place } = await google.maps.importLibrary("places");

  // ★★★ 【修正】centerを正しく使用 ★★★
  const request = {
    textQuery: 'restaurant',
    fields: ['displayName', 'location', 'rating', 'formattedAddress', 'photos'],
    locationBias: {
      center: { lat: center.latitude, lng: center.longitude },
      radius: 1000,
    },
    maxResultCount: 20,
  };

  console.log('📋 リクエスト内容:', JSON.stringify(request, null, 2));

  // ========================================
  // リトライ機能
  // ========================================
  const maxRetries = 3;
  let lastError;

  for (let i = 0; i < maxRetries; i++) {
    try {
      console.log(`📡 Places API 呼び出し中...(試行 ${i + 1}/${maxRetries})`);

      const { places } = await Place.searchByText(request);

      console.log('📡 Places API ステータス: OK');
      console.log('📊 検索結果:', places);

      if (!places || places.length === 0) {
        console.warn('⚠️ 検索結果が0件でした');
        return [];
      }

      console.log('✅ 検索成功:', places.length, '件');

      // デバッグ: 各レストランの情報を確認
      places.forEach((place, index) => {
        console.log(`${index + 1}. ${place.displayName || '名前なし'}`);
        console.log('  - location:', place.location);
        console.log('  - rating:', place.rating);
        console.log('  - formattedAddress:', place.formattedAddress);
      });

      // ★★★ ここに正規化処理を追加! ★★★
      const normalizedPlaces = places.map(place => {
        // displayNameの処理
        let name = '店名不明';
        if (place.displayName) {
          if (typeof place.displayName === 'string') {
            name = place.displayName;
          } else if (place.displayName.text) {
            name = place.displayName.text;
          } else if (typeof place.displayName.toString === 'function') {
            name = place.displayName.toString();
          }
        }

        // locationの処理
        let placeLatitude = null;
        let placeLongitude = null;
        if (place.location) {
          placeLatitude = typeof place.location.lat === 'function'
            ? place.location.lat()
            : place.location.lat;
          placeLongitude = typeof place.location.lng === 'function'
            ? place.location.lng()
            : place.location.lng;
        }

        // photosの処理
        let photoUrl = null;
        if (place.photos && place.photos.length > 0) {
          const photo = place.photos[0];
          if (typeof photo.getUrl === 'function') {
            photoUrl = photo.getUrl({ maxWidth: 400, maxHeight: 300 });
          }
        }

        return {
          name: name,
          latitude: placeLatitude,
          longitude: placeLongitude,
          rating: place.rating || null,
          address: place.formattedAddress || '住所情報なし',
          photoUrl: photoUrl,
          // 元のデータも保持(デバッグ用)
          _raw: place
        };
      });

      console.log('🔄 正規化後のデータ:', normalizedPlaces);

      return normalizedPlaces; // ← 正規化後のデータを返す!

    } catch (error) {
      lastError = error;
      console.warn(`⚠️ Places API エラー(試行 ${i + 1}/${maxRetries}):`, error.message);

      if (i < maxRetries - 1) {
        const waitTime = 1000 * (i + 1);
        console.log(`🔄 ${waitTime}ms 後にリトライします...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }

  // すべてのリトライが失敗
  console.error('❌ Places API エラー:', lastError);
  throw new Error(`Places API エラー: ${lastError.message}`);
}

/**
 * 2地点間の距離を計算(km単位)
 */
export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // 地球の半径(km)
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return (R * c).toFixed(1); // 小数点第1位まで
}

/**
 * レストランを距離順に並び替え
 */
export function sortByDistance(restaurants, userLocation) {
  return restaurants.sort((a, b) => {
    const distanceA = calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      a.latitude,  // ← 正規化後は直接プロパティにアクセス
      a.longitude
    );
    const distanceB = calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      b.latitude,  // ← 正規化後は直接プロパティにアクセス
      b.longitude
    );
    return distanceA - distanceB;
  });
}

/**
 * レストランを評価順に並び替え
 */
export function sortByRating(restaurants) {
  return restaurants.sort((a, b) => {
    return (b.rating || 0) - (a.rating || 0);
  });
}
