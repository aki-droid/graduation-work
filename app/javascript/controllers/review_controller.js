import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  showReviewDemo() {
    console.log('レビューデモを表示します')
    alert('レビュー機能のデモです!')
  }
}
