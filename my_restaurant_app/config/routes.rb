Rails.application.routes.draw do
  get 'pages/terms'
  get 'pages/privacy'
  get 'pages/contact'
  devise_for :users
  root "restaurants#index"

  # 🆕 静的ページ（利用規約・プライバシーポリシー・お問い合わせ）
  get 'terms', to: 'pages#terms'
  get 'privacy', to: 'pages#privacy'
  get 'contact', to: 'pages#contact'

  # 🆕 気分選択機能
  resources :moods, only: [:index] do
    collection do
      post :select
    end
  end

  # レストラン関連（フルCRUD + search + bookmarks）
  resources :restaurants do
    collection do
      get :search
    end

    member do
      get :bookmarks
    end
  end

  # 位置情報関連
  resources :locations, only: %i[index create]

  # ヘルスチェック
  get "up" => "rails/health#show", as: :rails_health_check

  # 開発用
  get 'home/index' if Rails.env.development?
end
