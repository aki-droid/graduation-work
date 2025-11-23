Rails.application.routes.draw do
  # Devise認証機能
  devise_for :users
  
  # ルートページ
  root "restaurants#index"
  
  # レストラン関連
  resources :restaurants do
    member do
      get :bookmarks  # ブックマーク一覧
    end
    collection do
      get :search     # 検索機能
    end
  end
  
  # ホームページ（オプション）
  get 'home/index'
  
  # 検索機能（別ルート）
  get 'search', to: 'restaurants#search'
  
  # 健康チェック用
  get "up" => "rails/health#show", as: :rails_health_check
end
