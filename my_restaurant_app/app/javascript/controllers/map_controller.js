import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static values = {
    latitude: Number,
    longitude: Number,
    name: String
  }

  static targets = ["container"]

  connect() {
    console.log("🗺️ 地図コントローラーが接続されました！")
    
    // 🆕 localStorageから座標を復元
    const savedLatitude = localStorage.getItem('user_latitude')
    const savedLongitude = localStorage.getItem('user_longitude')
    
    if (savedLatitude && savedLongitude) {
      this.latitudeValue = parseFloat(savedLatitude)
      this.longitudeValue = parseFloat(savedLongitude)
      console.log(`✅ 保存された座標を復元: 緯度=${this.latitudeValue}, 経度=${this.longitudeValue}`)
    } else {
      console.log(`📍 初期座標: 緯度=${this.latitudeValue}, 経度=${this.longitudeValue}`)
    }
    
    this.initializeMap()

    // 🔥 location.js からのイベントを受け取る
    this.handleLocationUpdateBound = this.handleLocationUpdate.bind(this)
    window.addEventListener("location:updated", this.handleLocationUpdateBound)
  }

  disconnect() {
    // イベントリスナーをクリーンアップ
    window.removeEventListener("location:updated", this.handleLocationUpdateBound)
  }

  // 🔥 location.js から座標を受け取る
  handleLocationUpdate(event) {
    console.log("📡 map_controller が座標を受信しました！", event.detail)

    // 座標を更新
    this.latitudeValue = event.detail.latitude
    this.longitudeValue = event.detail.longitude

    // 🆕 localStorageに保存
    localStorage.setItem('user_latitude', event.detail.latitude)
    localStorage.setItem('user_longitude', event.detail.longitude)
    console.log('💾 座標をlocalStorageに保存しました')

    console.log(`✅ 更新後の座標: 緯度=${this.latitudeValue}, 経度=${this.longitudeValue}`)

    // 地図を再描画
    this.initializeMap()
  }

  initializeMap() {
    const mapContainer = this.element
    mapContainer.innerHTML = `
      <div class="map-placeholder bg-light p-4 text-center border rounded">
        <h5>🗺️ ${this.nameValue || 'レストラン'} の地図</h5>
        <p>緯度: ${this.latitudeValue || '未設定'}</p>
        <p>経度: ${this.longitudeValue || '未設定'}</p>
        <div class="mt-3">
          <button
            data-action="click->map#showMapDemo"
            class="btn btn-primary me-2">
            地図を表示
          </button>
          <button
            data-action="click->map#showDirections"
            class="btn btn-success">
            ルートを表示
          </button>
        </div>
      </div>
    `
  }

  // 地図を新しいタブで表示
  showMapDemo(event) {
    event.preventDefault()
    console.log("🗺️ showMapDemo が実行されました！")

    if (this.hasValidCoordinates()) {
      const url = `https://www.google.com/maps?q=${this.latitudeValue},${this.longitudeValue}`
      window.open(url, '_blank')
    } else {
      this.showError()
    }
  }

  // ルート検索を表示
  showDirections(event) {
    if (event) event.preventDefault()
    console.log("🗺️ showDirections が実行されました！")

    if (this.hasValidCoordinates()) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${this.latitudeValue},${this.longitudeValue}`
      window.open(url, '_blank')
    } else {
      this.showError()
    }
  }

  // 座標が有効かチェック
  hasValidCoordinates() {
    return this.latitudeValue &&
           this.longitudeValue &&
           !isNaN(this.latitudeValue) &&
           !isNaN(this.longitudeValue) &&
           this.latitudeValue !== 0 &&
           this.longitudeValue !== 0
  }

  // エラーメッセージを表示
  showError() {
    alert('位置情報が正しく設定されていません')
  }
}
