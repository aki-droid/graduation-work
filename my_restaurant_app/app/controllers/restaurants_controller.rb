class RestaurantsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_restaurant, only: [:show, :edit, :update, :destroy]
  before_action :check_owner, only: [:edit, :update, :destroy]

  def index
    @restaurants = current_user.restaurants.order(created_at: :desc)
  end

  def show
    # before_actionで設定済み
  end

  # 🆕 新規追加が必要なアクション
  def new
    @restaurant = current_user.restaurants.build
  end

  def edit
    # before_actionで設定済み
  end

  def create
    @restaurant = current_user.restaurants.build(restaurant_params)
    
    if @restaurant.save
      redirect_to @restaurant, notice: 'レストランが正常に作成されました。'
    else
      render :new, status: :unprocessable_entity
    end
  end

  def update
    if @restaurant.update(restaurant_params)
      redirect_to @restaurant, notice: 'レストランが正常に更新されました。'
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @restaurant.destroy
    redirect_to restaurants_url, notice: 'レストランが正常に削除されました。'
  end

  # 🔄 既存のメソッドはそのまま
  def search
    if params[:keyword].present?
      keyword = "%#{params[:keyword].strip}%"
      @restaurants = current_user.restaurants.where(
        "name ILIKE ? OR address ILIKE ? OR description ILIKE ?",
        keyword, keyword, keyword
      ).order(:name)
    else
      @restaurants = Restaurant.none
    end
  end

  def bookmarks
    @restaurant = Restaurant.find(params[:id]) if params[:id].present?
    @restaurants = []
  end

  private

  def set_restaurant
    @restaurant = Restaurant.find(params[:id])
  end

  # 🆕 新規追加が必要なメソッド
  def check_owner
    redirect_to restaurants_path, alert: '権限がありません。' unless @restaurant.user == current_user
  end

  def restaurant_params
    params.require(:restaurant).permit(:name, :address, :phone, :description, :category, :latitude, :longitude)
  end
end
