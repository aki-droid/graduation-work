class RestaurantsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_restaurant, only: [:show, :edit, :update, :destroy]
  before_action :check_owner, only: [:edit, :update, :destroy]

  def index
    @restaurants = current_user.restaurants.order(created_at: :desc)
  end

  def show
  end

  def new
    @restaurant = current_user.restaurants.build
  end

  def edit
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

  def search
    @restaurants = Restaurant.all

    # 気分検索（追加）
    if params[:mood].present?
      @restaurants = @restaurants.where(mood: params[:mood])
    end

    # キーワード検索
    if params[:keyword].present?
      keyword = "%#{params[:keyword].strip}%"
      @restaurants = @restaurants.where(
        "name ILIKE ? OR address ILIKE ? OR description ILIKE ?",
        keyword, keyword, keyword
      )
    end

    # 位置情報検索
    if params[:latitude].present? && params[:longitude].present?
      @latitude  = params[:latitude].to_f
      @longitude = params[:longitude].to_f
      @radius    = params[:radius]&.to_f || 5.0

      @restaurants = @restaurants.near(
        [@latitude, @longitude],
        @radius,
        units: :km,
        order: false
      )
    end

    # カテゴリ検索
    if params[:category].present?
      @restaurants = @restaurants.where(category: params[:category])
    end
  end

  private

  def set_restaurant
    @restaurant = Restaurant.find(params[:id])
  end

  def check_owner
    redirect_to restaurants_path, alert: '権限がありません。' unless @restaurant.user == current_user
  end

  def restaurant_params
    params.require(:restaurant).permit(
      :name, :address, :phone, :description, :category, :latitude, :longitude
    )
  end
end
