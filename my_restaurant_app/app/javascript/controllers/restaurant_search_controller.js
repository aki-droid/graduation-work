import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  showSearchDemo() {
    console.log('レストラン検索デモを表示します')
    alert('レストラン検索機能のデモです!')
  }
}
