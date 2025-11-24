import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["query", "results"]
  
  connect() {
    console.log("🍽️ レストラン検索コントローラーが接続されました！")
  }
  
  search() {
    const query = this.queryTarget.value
    console.log(`検索クエリ: ${query}`)
    
    this.resultsTarget.innerHTML = `
      <div class="alert alert-info">
        「${query}」で検索中...
      </div>
    `
  }
  
  clear() {
    this.queryTarget.value = ""
    this.resultsTarget.innerHTML = ""
    console.log("検索結果をクリアしました")
  }
}
