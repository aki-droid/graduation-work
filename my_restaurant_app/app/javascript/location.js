console.log('📍 location.js loaded');

import { searchRestaurants } from "restaurant_search"

let initialized = false;
let userTriggeredSearch = false;

// Turbo遷移前に初期化フラグをリセット
document.addEventListener("turbo:before-render", () => {
  console.log("♻️ turbo:before-render → initialized をリセット");
  initialized = false;
});

// 初期化処理
document.addEventListener("turbo:load", init);

function init() {
  if (initialized) {
    console.log("⏭️ 既に初期化済みのためスキップ");
    return;
  }
  initialized = true;

  console.log('🔄 位置情報機能 初期化');
  clearError();

  // ソートコントロールを初期非表示
  const sortControls = document.getElementById('sort-controls');
  if (sortControls) {
    sortControls.style.display = 'none';
  }

  // ⭐ 気分選択ボタンのイベントリスナー追加
  document.querySelectorAll('.mood-btn').forEach(btn => {
    btn.addEventListener('click', handleMoodSelection);
  });

  // イベントリスナーの登録
  document
    .getElementById('search-by-current-location')
    ?.addEventListener('click', handleGoogleSearch);

  // ⭐ 修正: IDを正しいものに変更
  document
    .getElementById('server-side-current-location')
    ?.addEventListener('click', handleServerSideSearch);

  document
    .getElementById('sort-select')
    ?.addEventListener('change', handleSortChange);

  console.log('✅ 位置情報機能の初期化完了');
}

/* ================================
   気分選択処理
================================ */
function handleMoodSelection(e) {
  const btn = e.currentTarget;
  const moodId = btn.dataset.moodId;
  const moodName = btn.dataset.moodName;

  console.log('😊 気分選択:', moodName);

  // すべての気分ボタンの選択状態をリセット
  document.querySelectorAll('.mood-btn').forEach(b => {
    b.classList.remove('active');
    b.classList.replace('btn-primary', 'btn-outline-primary');
  });

  // 選択されたボタンをアクティブ化
  btn.classList.add('active');
  btn.classList.replace('btn-outline-primary', 'btn-primary');

  // 選択した気分を表示
  const selectedMoodDiv = document.getElementById('selected-mood');
  const selectedMoodName = document.getElementById('selected-mood-name');

  if (selectedMoodDiv && selectedMoodName) {
    selectedMoodName.textContent = moodName;
    selectedMoodDiv.style.display = 'block';
  }

  // 検索ボタンを有効化
  const searchBtn = document.getElementById('search-by-current-location');
  if (searchBtn) {
    searchBtn.disabled = false;
    searchBtn.classList.remove('btn-secondary');
    searchBtn.classList.add('btn-primary');
  }

  // 選択した気分をグローバル変数に保存(検索時に使用)
  window.selectedMoodId = moodId;
}

/* ================================
   Google Places API 検索
================================ */
async function handleGoogleSearch() {
  console.log('🔍 Google Places API検索を開始');
  userTriggeredSearch = true;

  // ⭐ 気分が選択されているか確認
  if (!window.selectedMoodId) {
    showError('気分を選択してください');
    return;
  }

  showLoading(true);
  clearError();

  try {
    // 位置情報取得
    const position = await getPosition();
    const { latitude, longitude } = position.coords;

    console.log('📍 現在地取得成功:', { latitude, longitude });

    // ⭐ 検索半径を取得
    const radiusSelect = document.getElementById('google-places-radius');
    const radiusKm = radiusSelect ? parseFloat(radiusSelect.value) : 2;
    const radiusMeters = radiusKm * 1000;

    console.log('📏 検索半径:', radiusKm, 'km (', radiusMeters, 'm)');
    console.log('🆔 選択された気分ID:', window.selectedMoodId);

    // ⭐ 修正: 変数名を正しいものに変更
    const restaurants = await searchRestaurants(
      latitude,              // ✅ currentLatitude → latitude
      longitude,             // ✅ currentLongitude → longitude
      window.selectedMoodId, // ✅ currentMoodId → window.selectedMoodId
      radiusMeters           // ✅ searchRadius → radiusMeters
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

  let message = '検索中にエラーが発生しました';

  if (e.code) {
    message = {
      [e.PERMISSION_DENIED]: '位置情報の利用が許可されていません',
      [e.POSITION_UNAVAILABLE]: '位置情報を取得できませんでした',
      [e.TIMEOUT]: '位置情報の取得がタイムアウトしました'
    }[e.code] || message;
  }

  // ⭐ ユーザー操作があった時だけエラー表示
  if (userTriggeredSearch) {
    showError(message);
  }
  } finally {
    showLoading(false);
  }
}

/* ================================
   サーバーサイド検索
================================ */
async function handleServerSideSearch() {
  console.log('🔍 サーバーサイド検索を開始');
  userTriggeredSearch = true;

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
      showError('検索フォームが見つかりませんでした');
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

    if (userTriggeredSearch) {
      showError(message);
    }
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
        条件に合うお店が見つかりませんでした
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

          ${window.isLoggedIn ? `
            <button
              class="btn btn-outline-warning btn-sm favorite-btn mb-2"
              data-place-id="${r.placeId}"
              data-name="${r.name}"
              data-address="${r.address}"
              data-rating="${r.rating || ''}">
              ⭐ お気に入り
            </button>

            <br>
            
            ` : ''}

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

  document.querySelectorAll('.favorite-btn').forEach(button => {
    button.addEventListener('click', async () => {

      const data = {
        favorite: {
          place_id: button.dataset.placeId,
          name: button.dataset.name,
          address: button.dataset.address,
          rating: button.dataset.rating
        }
      };

      const response = await fetch('/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': document
            .querySelector('meta[name="csrf-token"]')
            .content
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();
            
      if (result.success) {
        alert("お気に入りに追加しました");
      } else {
        alert(result.message || "すでに登録されています");
      }
    });
  });

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
