class ApplicationController < ActionController::Base
  before_action :authenticate_user!
  before_action :configure_permitted_parameters, if: :devise_controller?

  # 🔽 ログイン直後は検索画面へ
  def after_sign_in_path_for(resource)
    search_restaurants_path
  end

  private

  def configure_permitted_parameters
    # 新規登録時にnameパラメータを許可
    devise_parameter_sanitizer.permit(:sign_up, keys: [:name])

    # プロフィール更新時にnameパラメータを許可
    devise_parameter_sanitizer.permit(:account_update, keys: [:name])
  end
end
