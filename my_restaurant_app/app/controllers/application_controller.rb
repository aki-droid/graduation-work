class ApplicationController < ActionController::Base
  # 全ページでログイン必須にする
  before_action :authenticate_user!
  
  # Devise用パラメータ設定
  before_action :configure_permitted_parameters, if: :devise_controller?

  # ログイン直後は検索画面へ
  def after_sign_in_path_for(resource)
    search_restaurants_path
  end

  private

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:name])
    devise_parameter_sanitizer.permit(:account_update, keys: [:name])
  end
end
