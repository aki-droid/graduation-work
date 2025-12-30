import "@hotwired/turbo-rails";
import "./controllers";
// 位置情報
import "./location";
import "./moods_ui";
import "./restaurant_search";
import "./map";
// Bootstrap
import * as bootstrap from "bootstrap";

console.log("🍽️ JS 初期化開始");

// ============================
// Bootstrap 初期化
// ============================
document.addEventListener("turbo:load", () => {
  console.log("🔧 Bootstrap 初期化開始");

  // ドロップダウン初期化（クリックイベントは書かない）
  document.querySelectorAll('[data-bs-toggle="dropdown"]').forEach((el) => {
    if (!bootstrap.Dropdown.getInstance(el)) {
      new bootstrap.Dropdown(el);
    }
  });

  console.log("✅ Bootstrap 初期化完了");
});


window.bootstrap = bootstrap;
