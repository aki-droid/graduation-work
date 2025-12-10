Rails.application.routes.draw do
  get 'moods/index'
  devise_for :users
  root "restaurants#index"

  # 🆕 気分選択機能
  resources :moods, only: [:index] do
    collection do
      post :select  # 気分を選択する
    end
  end

  # レストラン関連（フルCRUD + search + bookmarks）
  resources :restaurants do
    collection do
      get :search
    end

    member do
      get :bookmarks  # 将来実装予定
    end
  end

  # 位置情報関連
  resources :locations, only: %i[index create]

  # ヘルスチェック
  get "up" => "rails/health#show", as: :rails_health_check

  # 開発用
  get 'home/index' if Rails.env.development?
end
