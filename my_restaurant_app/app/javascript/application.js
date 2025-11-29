// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
import "@hotwired/turbo-rails"
import "controllers"
import "bootstrap"
import "location"

console.log('JavaScript loaded successfully!');
console.log('Bootstrap loaded!');
console.log('🍽️ 飲食店アプリ用JavaScript初期化完了！');

// Bootstrap初期化
document.addEventListener('DOMContentLoaded', () => {
  // Bootstrap tooltips initialization
  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
  const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))

  // Bootstrap popovers initialization
  const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]')
  const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl))
})
