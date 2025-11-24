import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["rating", "comment", "form"]
  
  connect() {
    console.log("⭐ レビューコントローラーが接続されました！")
  }
  
  selectRating(event) {
    const rating = event.currentTarget.dataset.rating
    this.ratingTarget.value = rating
    
    this.updateStarDisplay(rating)
    console.log(`評価: ${rating}星`)
  }
  
  updateStarDisplay(rating) {
    const stars = this.element.querySelectorAll('.star')
    stars.forEach((star, index) => {
      if (index < rating) {
        star.classList.add('active')
        star.innerHTML = '⭐'
      } else {
        star.classList.remove('active')
        star.innerHTML = '☆'
      }
    })
  }
  
  submitReview(event) {
    event.preventDefault()
    const rating = this.ratingTarget.value
    const comment = this.commentTarget.value
    
    if (!rating) {
      alert('評価を選択してください')
      return
    }
    
    console.log(`レビュー送信: ${rating}星, コメント: ${comment}`)
  }
}
