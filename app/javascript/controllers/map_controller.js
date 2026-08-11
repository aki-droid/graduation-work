import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static values = {
    latitude: Number,
    longitude: Number,
    name: String
  }

  connect() {
    console.log("🗺️ map_controller connected")

    // Google Maps API が読み込まれるまで待機
    this.waitForGoogleMaps().then(() => this.renderMap())
  }

  disconnect() {
    // 必要に応じてイベントリスナーなどを解除
    window.removeEventListener('resize', this.resizeHandler)
  }

  // Google Maps API が読み込まれるまでポーリング
  waitForGoogleMaps() {
    return new Promise((resolve) => {
      if (window.google && window.google.maps) {
        resolve()
      } else {
        const interval = setInterval(() => {
          if (window.google && window.google.maps) {
            clearInterval(interval)
            resolve()
          }
        }, 100)
      }
    })
  }

  // 座標が有効かどうかをチェック
  hasValidCoordinates() {
    return (
      this.latitudeValue !== undefined &&
      this.longitudeValue !== undefined &&
      !isNaN(this.latitudeValue) &&
      !isNaN(this.longitudeValue)
    )
  }

  // 地図描画
  renderMap() {
    if (!this.hasValidCoordinates()) {
      this.showError()
      return
    }

    console.log(`🗺️ Rendering map at lat:${this.latitudeValue}, lng:${this.longitudeValue}`)

    // コンテナをリセット
    this.element.innerHTML = ""

    const mapDiv = document.createElement("div")
    mapDiv.style.width = "100%"
    mapDiv.style.height = "300px"
    this.element.appendChild(mapDiv)

    const position = {
      lat: this.latitudeValue,
      lng: this.longitudeValue
    }

    // 地図生成
    this.map = new google.maps.Map(mapDiv, {
      center: position,
      zoom: 16,
      gestureHandling: "greedy",
      fullscreenControl: false
    })

    // マーカー生成
    this.marker = new google.maps.Marker({
      position: position,
      map: this.map,
      title: this.nameValue || "地点"
    })

    // 情報ウィンドウ生成
    this.infoWindow = new google.maps.InfoWindow({
      content: `<strong>${this.nameValue || "地点"}</strong>`
    })

    // マーカークリックで情報ウィンドウ表示
    this.marker.addListener('click', () => {
      this.infoWindow.open(this.map, this.marker)
    })

    // ウィンドウリサイズ時に地図中心を維持
    this.resizeHandler = () => {
      if (this.map) {
        this.map.setCenter(position)
      }
    }
    window.addEventListener('resize', this.resizeHandler)
  }

  // 座標が無効な場合の表示
  showError() {
    this.element.innerHTML = `
      <div class="alert alert-warning text-center">
        <p>位置情報が正しく設定されていません。</p>
      </div>
    `
  }
}
