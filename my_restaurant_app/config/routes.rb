Rails.application.routes.draw do
  devise_for :users
  root "restaurants#index"

  # レストラン関連（フルCRUD + search + bookmarks）
  resources :restaurants do
    collection do
      get :search
    end
    
    member do
      get :bookmarks  # 将来実装予定
    end
  end

  # ヘルスチェック
  get "up" => "rails/health#show", as: :rails_health_check

  # 開発用
  get 'home/index' if Rails.env.development?
end
