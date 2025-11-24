# app/controllers/restaurants_controller.rb
class RestaurantsController < ApplicationController
  before_action :set_restaurant, only: [:show]

  def index
    @restaurants = Restaurant.all.order(:name)
  end

  def show
    # before_actionで設定済み
  end

  def search
    if params[:keyword].present?
      keyword = "%#{params[:keyword].strip}%"
      @restaurants = Restaurant.where(
        "name ILIKE ? OR address ILIKE ? OR description ILIKE ?", 
        keyword, keyword, keyword
      ).order(:name)
    else
      @restaurants = Restaurant.none
    end
  end

  def bookmarks
    # 将来実装予定のブックマーク機能
    @restaurant = Restaurant.find(params[:id]) if params[:id].present?
    @restaurants = [] # 仮の実装
  end

  private

  def set_restaurant
    @restaurant = Restaurant.find(params[:id])
  end
end
