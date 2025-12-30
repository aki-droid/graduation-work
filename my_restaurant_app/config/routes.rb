Rails.application.routes.draw do
  devise_for :users

  # ログイン済みかどうかでルートを切り替える
  authenticated :user do
    root "restaurants#search", as: :authenticated_root
  end

  unauthenticated do
    root "home#index", as: :unauthenticated_root
  end

   # 通常のroot
  root "home#index"

  # 静的ページ
  get 'terms',   to: 'pages#terms'
  get 'privacy', to: 'pages#privacy'
  get 'contact', to: 'pages#contact'

  # 気分選択
  resources :moods, only: [:index] do
    collection do
      post :select
    end
  end

  # レストラン関連
  resources :restaurants do
    collection do
      get :search
    end

    member do
      get :bookmarks
    end
  end

  # 位置情報
  resources :locations, only: %i[index create]

  # ヘルスチェック
  get "up" => "rails/health#show", as: :rails_health_check
end
