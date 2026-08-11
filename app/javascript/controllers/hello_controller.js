import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  connect() {
    console.log("✅ Hello controller connected!")
  }

  // greetメソッドを追加
  greet() {
    alert("🎉 JavaScript動作テスト成功！\n✅ Stimulusコントローラーが正常に動作しています！")
    console.log("🚀 greetメソッドが実行されました！")
  }
}
