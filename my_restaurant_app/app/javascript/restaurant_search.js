console.log('✅ restaurant_search.js が読み込まれました');

// ========================================
// 気分ごとの検索条件
// ========================================
const MOOD_SEARCH_CONFIG = {
  1: { // 元気
    keywords: ['カジュアル', 'ランチ', '定食', '和食', 'カフェ'],
    minRating: 3.0
  },

  2: { // 疲れた
    keywords: ['定食', '和食', 'カフェ', 'ラーメン', '落ち着く'],
    minRating: 3.2
  },

  3: { // おちこんでいる
    keywords: ['カフェ', 'スイーツ', 'ラーメン', '定食', '癒し'],
    minRating: 3.5
  },

  4: { // がっつり食べたい
    keywords: ['ラーメン', '焼肉', '定食', '丼もの', 'ボリューム'],
    minRating: 3.0
  },

  5: { // 軽く済ませたい
    keywords: ['ファストフード', 'カフェ', 'テイクアウト', '軽食'],
    minRating: 3.0
  },

  6: { // おしゃれしたい
    keywords: ['フレンチ', 'イタリアン', '高級和食', 'バー', 'おしゃれ'],
    minRating: 4.0
  },

  7: { // ワイワイしたい
    keywords: ['居酒屋', '焼肉', 'バル', 'バー', 'にぎやか'],
    minRating: 3.2
  },

  8: { // まったりしたい
    keywords: ['カフェ', 'スイーツ', '静か', 'ゆったり', '落ち着く'],
    minRating: 3.5
  }
};

// ========================================
// 離計算関数(ヒュベニの公式)
// ========================================
function calculateDistanceInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // 地球の半径(km)
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
    Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// 度をラジアンに変換
function toRad(degrees) {
  return degrees * Math.PI / 180;
}

// ========================================
// レストラン検索関数(Places API New版)
// ========================================
export async function searchRestaurants(
  latitude,
  longitude,
  moodId,
  radius = 2000  // メートル単位
) {
  console.log('🔍 レストラン検索開始');

  // 気分IDを数値に変換
  const mood = parseInt(moodId);
  const config = MOOD_SEARCH_CONFIG[mood];

  if (!config) {
    console.error('❌ 無効な気分ID:', moodId);
    throw new Error('無効な気分が選択されました');
  }

  console.log('😊 選択された気分:', mood);
  console.log('📋 気分設定:', config);

  // 数値型に変換
  const lat = typeof latitude === 'number' ? latitude : parseFloat(latitude);
  const lng = typeof longitude === 'number' ? longitude : parseFloat(longitude);

  console.log('📍 緯度:', lat, '(型:', typeof lat, ')');
  console.log('📍 経度:', lng, '(型:', typeof lng, ')');
  console.log('🔑 キーワード:', config.keywords);
  console.log('⭐ 最低評価:', config.minRating);
  console.log('📏 検索半径:', radius, 'メートル');

  //  検索半径をkmに変換(距離フィルタリング用)
  const radiusKm = radius / 1000;
  const maxDistance = radiusKm * 1.5;
  console.log('📏 フィルタリング用半径:', maxDistance, 'km');

  // バリデーション
  if (isNaN(lat) || isNaN(lng)) {
    console.error('❌ 座標が不正:', { latitude, longitude });
    throw new Error('緯度・経度が正しく取得できませんでした');
  }

  const center = {
    latitude: lat,
    longitude: lng
  };

  console.log('🎯 検索中心座標:', center);

  const { Place } = await google.maps.importLibrary("places");

  const request = {
    textQuery: config.keywords.join(' '),
    fields: ['id', 'displayName', 'location', 'rating', 'formattedAddress', 'photos'],
    locationBias: {
      center: { lat: lat, lng: lng },
      radius: radius,
    },
    language: 'ja',
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

          // ========================================
          // 評価でフィルタリング
          // ========================================
          let filteredPlaces = places.filter(place => {
            const rating = place.rating || 0;
            return rating >= config.minRating;
          });

          console.log('⭐ 評価フィルタ後:', filteredPlaces.length, '件');

          // ========================================
          // 距離フィルタリング(追加)
          // ========================================
          filteredPlaces = filteredPlaces.filter(place => {
            // locationの取得
            let placeLat = null;
            let placeLng = null;

            if (place.location) {
              placeLat = typeof place.location.lat === 'function'
                ? place.location.lat()
                : place.location.lat;
              placeLng = typeof place.location.lng === 'function'
                ? place.location.lng()
                : place.location.lng;
            }

            // 座標が取得できない場合は除外
            if (placeLat === null || placeLng === null) {
              console.warn('⚠️ 座標が取得できません:', place.displayName);
              return false;
            }

            // 距離計算
            const distance = calculateDistanceInKm(lat, lng, placeLat, placeLng);

            // displayNameの取得
            let name = '店名不明';
            if (place.displayName) {
              if (typeof place.displayName === 'string') {
                name = place.displayName;
              } else if (place.displayName.text) {
                name = place.displayName.text;
              }
            }

            console.log(`📏 ${name}: ${distance.toFixed(2)} km`);

            // 半径内かチェック
            return distance <= (radiusKm * 1.5);
          });

          console.log('📏 距離フィルタ後:', filteredPlaces.length, '件');

          // デバッグ: 各レストランの情報を確認
          filteredPlaces.forEach((place, index) => {
            console.log(`${index + 1}. ${place.displayName || '名前なし'}`);
            console.log('  - location:', place.location);
            console.log('  - rating:', place.rating);
            console.log('  - formattedAddress:', place.formattedAddress);
          });

 // ========================================
          // 正規化処理
          // ========================================
          const normalizedPlaces = filteredPlaces.map(place => {
            console.log("Placeデータ", place);
            console.log("Place ID", place.id);
            
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
              if (typeof photo.getURI === 'function') {
                photoUrl = photo.getURI({ maxWidth: 400, maxHeight: 300 });
                console.log('🖼️ 写真URL生成:', photoUrl);
              } else {
                console.warn('⚠️ getURI()が利用できません:', photo);
              }
            } else {
              console.log('⚠️ 写真データがありません:', name);
            }

            return {
              placeId: place.id,
              name: name,
              latitude: placeLatitude,
              longitude: placeLongitude,
              rating: place.rating || null,
              address: place.formattedAddress || '住所情報なし',
              photoUrl: photoUrl,
              // 元のデータも保持(デバッグ用)
            };
          });

          console.log('🔄 正規化後のデータ:', normalizedPlaces);
          normalizedPlaces.forEach(place => {
            console.log('⭐ placeId:', place.placeId);
          });

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

// ========================================
// ユーティリティ関数
// ========================================

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

// ========================================
// グローバルに公開
// ========================================
window.RestaurantSearch = {
  searchRestaurants,
  calculateDistance,
  sortByDistance,
  sortByRating
};

console.log('✅ RestaurantSearch をグローバルに公開しました');
