console.log('📍 location.js loaded');

import { searchRestaurants } from './restaurant_search';

let initialized = false;

// Turbo遷移前に初期化フラグをリセット
document.addEventListener("turbo:before-render", () => {
  console.log("♻️ turbo:before-render → initialized をリセット");
  initialized = false;
});

// 初期化処理
document.addEventListener("turbo:load", init);
document.addEventListener("DOMContentLoaded", init);

function init() {
  if (initialized) {
    console.log("⏭️ 既に初期化済みのためスキップ");
    return;
  }
  initialized = true;

  console.log('🔄 位置情報機能 初期化');

  // ソートコントロールを初期非表示
  const sortControls = document.getElementById('sort-controls');
  if (sortControls) {
    sortControls.style.display = 'none';
  }

  // イベントリスナーの登録
  document
    .getElementById('search-by-current-location')
    ?.addEventListener('click', handleGoogleSearch);

  document
    .getElementById('getCurrentLocation')
    ?.addEventListener('click', handleServerSideSearch);

  document
    .getElementById('sort-select')
    ?.addEventListener('change', handleSortChange);

  console.log('✅ 位置情報機能の初期化完了');
}

/* ================================
   Google Places API 検索
================================ */
async function handleGoogleSearch() {
  console.log('🔍 Google Places API検索を開始');
  
  showLoading(true);
  clearError(); // エラー表示をクリア

  try {
    // 位置情報取得
    const position = await getPosition();
    const { latitude, longitude } = position.coords;

    console.log('📍 現在地取得成功:', { latitude, longitude });

    // レストラン検索
    const restaurants = await searchRestaurants(
      latitude,
      longitude,
      ['restaurant']
    );

    console.log('🍽️ 検索結果:', restaurants.length, '件');

    // 距離を付与してソート
    window.currentResults = attachDistance(
      restaurants,
      latitude,
      longitude
    );

    // ソートコントロールを表示
    const sortControls = document.getElementById('sort-controls');
    if (sortControls) {
      sortControls.style.display = 'block';
    }

    // 結果を描画
    renderResults(window.currentResults);

  } catch (e) {
    console.error('❌ 検索エラー:', e);

    // エラーの種類に応じてメッセージを変える
    let message = '検索中にエラーが発生しました';

    if (e.code) {
      // 位置情報取得エラー
      message = {
        [e.PERMISSION_DENIED]: '位置情報の利用が許可されていません',
        [e.POSITION_UNAVAILABLE]: '位置情報を取得できませんでした',
        [e.TIMEOUT]: '位置情報の取得がタイムアウトしました'
      }[e.code] || message;
    }

    showError(message);
  } finally {
    showLoading(false);
  }
}

/* ================================
   サーバーサイド検索
================================ */
async function handleServerSideSearch() {
  console.log('🔍 サーバーサイド検索を開始');
  
  try {
    const position = await getPosition();
    
    const latInput = document.getElementById('latitude');
    const lngInput = document.getElementById('longitude');
    const form = document.getElementById('searchForm');
    
    if (latInput && lngInput && form) {
      latInput.value = position.coords.latitude;
      lngInput.value = position.coords.longitude;
      
      console.log('📍 座標をフォームに設定:', {
        latitude: latInput.value,
        longitude: lngInput.value
      });
      
      form.submit();
    } else {
      console.error('❌ フォーム要素が見つかりません');
      alert('検索フォームが見つかりませんでした');
    }
  } catch (e) {
    console.error('❌ 位置情報取得エラー:', e);
    
    let message = '位置情報の取得に失敗しました';
    
    if (e.code) {
      message = {
        [e.PERMISSION_DENIED]: '位置情報の利用が許可されていません',
        [e.POSITION_UNAVAILABLE]: '位置情報を取得できませんでした',
        [e.TIMEOUT]: '位置情報の取得がタイムアウトしました'
      }[e.code] || message;
    }
    
    alert(message);
  }
}

/* ================================
   ソート切り替え
================================ */
function handleSortChange(e) {
  const value = e.target.value;
  console.log('🔄 ソート切り替え:', value);
  
  if (!window.currentResults) {
    console.warn('⚠️ 検索結果がありません');
    return;
  }
  
  let results = [...window.currentResults];

  if (value === 'distance') {
    results.sort((a, b) => a.distance - b.distance);
    console.log('📊 距離順にソート');
  }

  if (value === 'rating') {
    results.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    console.log('📊 評価順にソート');
  }

  renderResults(results);
}

/* ================================
   描画処理
================================ */
function renderResults(restaurants) {
  console.log('🎨 検索結果を描画:', restaurants.length, '件');
  
  const container = document.getElementById('search-results');
  
  if (!container) {
    console.error('❌ search-results 要素が見つかりません');
    return;
  }
  
  container.innerHTML = '';

  if (!restaurants.length) {
    container.innerHTML = `
      <div class="alert alert-info text-center">
        <i class="fas fa-info-circle me-2"></i>
        周辺にレストランが見つかりませんでした
      </div>`;
    return;
  }

  const row = document.createElement('div');
  row.className = 'row';

  restaurants.forEach(r => {
    const col = document.createElement('div');
    col.className = 'col-md-6 col-lg-4 mb-4';

    col.innerHTML = `
      <div class="card h-100 shadow-sm">
        ${r.photoUrl ? `
          <img src="${r.photoUrl}" 
               class="card-img-top" 
               alt="${r.name}"
               style="height:200px; object-fit:cover;"
               onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
          <div class="card-img-top bg-light justify-content-center align-items-center"
               style="height:200px; display:none;">
            <i class="fas fa-utensils fa-3x text-muted"></i>
          </div>
        ` : `
          <div class="card-img-top bg-light d-flex justify-content-center align-items-center"
               style="height:200px;">
            <i class="fas fa-utensils fa-3x text-muted"></i>
          </div>
        `}

        <div class="card-body">
          <h5 class="card-title">${r.name}</h5>

          <div class="mb-2">
            ${r.distance !== undefined ? `
              <span class="badge bg-success">
                <i class="fas fa-walking me-1"></i>
                約 ${r.distance.toFixed(1)} km
              </span>
            ` : ''}

            ${r.rating ? `
              <span class="badge bg-warning text-dark ms-2">
                ★ ${r.rating}
              </span>
            ` : ''}
          </div>

          <p class="text-muted small mt-2 mb-0">
            <i class="fas fa-map-marker-alt me-1"></i>
            ${r.address}
          </p>
        </div>

        <div class="card-footer bg-white text-center">
          <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(r.name)}"
             target="_blank"
             class="btn btn-outline-primary btn-sm">
            <i class="fas fa-map-marked-alt me-1"></i>Googleマップで見る
          </a>
        </div>
      </div>
    `;

    row.appendChild(col);
  });

  container.appendChild(row);
  console.log('✅ 描画完了');
}

/* ================================
   共通ユーティリティ
================================ */

// 位置情報取得
function getPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('このブラウザは位置情報に対応していません'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      resolve,
      reject,
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  });
}

// 距離を付与してソート
function attachDistance(restaurants, lat, lng) {
  return restaurants.map(r => ({
    ...r,
    distance: calcDistance(lat, lng, r.latitude, r.longitude)
  })).sort((a, b) => a.distance - b.distance);
}

// ヒュベニの公式による距離計算
function calcDistance(lat1, lon1, lat2, lon2) {
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
const toRad = d => d * Math.PI / 180;

/* ================================
   UI制御関数
================================ */

// ローディング表示の切り替え
function showLoading(show) {
  const loading = document.getElementById('search-loading');
  if (loading) {
    loading.style.display = show ? 'block' : 'none';
  }
}

// エラー表示
function showError(message) {
  const box = document.getElementById('search-error');
  const msg = document.getElementById('search-error-message');
  
  if (box && msg) {
    msg.textContent = message;
    box.style.display = 'block';
    
    console.error('❌ エラー表示:', message);
  }
}

// エラー表示をクリア
function clearError() {
  const box = document.getElementById('search-error');
  if (box) {
    box.style.display = 'none';
  }
}
