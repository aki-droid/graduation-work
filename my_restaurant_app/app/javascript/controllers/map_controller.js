import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static values = { 
    latitude: Number, 
    longitude: Number,
    name: String 
  }
  
  connect() {
    console.log("🗺️ 地図コントローラーが接続されました！")
    this.initializeMap()
  }
  
  initializeMap() {
    // 後でGoogle Maps APIやLeafletを統合予定
    const mapContainer = this.element
    mapContainer.innerHTML = `
      <div class="map-placeholder bg-light p-4 text-center border rounded">
        <h5>🗺️ ${this.nameValue || 'レストラン'} の地図</h5>
        <p>緯度: ${this.latitudeValue || '未設定'}</p>
        <p>経度: ${this.longitudeValue || '未設定'}</p>
        <small class="text-muted">地図機能は後で実装予定</small>
      </div>
    `
  }
  
  showDirections() {
    if (this.latitudeValue && this.longitudeValue) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${this.latitudeValue},${this.longitudeValue}`
      window.open(url, '_blank')
    } else {
      alert('位置情報が設定されていません')
    }
  }
}
