import "@hotwired/turbo-rails"
import "./controllers"
import * as bootstrap from "bootstrap"
import "./location"

console.log("🍽️ 飲食店アプリ用JavaScript初期化完了！");

// ✅ Turboのイベントを使用してBootstrapを初期化
document.addEventListener('turbo:load', initializeBootstrap);
document.addEventListener('DOMContentLoaded', initializeBootstrap);

function initializeBootstrap() {
  console.log("🔧 Bootstrap初期化開始");
  
  // ドロップダウン要素を取得
  const dropdownElements = document.querySelectorAll('[data-bs-toggle="dropdown"]');
  console.log("📌 見つかったDropdown要素:", dropdownElements.length + "個");
  
  if (dropdownElements.length === 0) {
    console.warn("⚠️ Dropdown要素が見つかりません");
    return;
  }
  
  // 各ドロップダウンを初期化
  dropdownElements.forEach((element) => {
    try {
      // 既存のインスタンスを破棄
      const existingInstance = bootstrap.Dropdown.getInstance(element);
      if (existingInstance) {
        existingInstance.dispose();
        console.log("🗑️ 既存のDropdownインスタンスを破棄:", element.id);
      }
      
      // 新しいインスタンスを作成
      const dropdown = new bootstrap.Dropdown(element, {
        autoClose: true,  // 外側クリックで閉じる
        boundary: 'viewport'  // 表示範囲を指定
      });
      
      console.log("✅ Dropdown初期化:", element.id || "無名要素");
      
      // クリックイベントを手動で追加(念のため)
      element.addEventListener('click', function(e) {
        e.preventDefault();
        console.log("🖱️ Dropdownがクリックされました:", element.id);
        dropdown.toggle();
      });
      
    } catch (error) {
      console.error("❌ Dropdown初期化エラー:", error);
    }
  });
  
  console.log("✅ Bootstrap初期化完了");
}

// Bootstrapをグローバルに公開(デバッグ用)
window.bootstrap = bootstrap;
