class FavoritesController < ApplicationController
  before_action :authenticate_user!

  def index
    @favorites = current_user.favorites
  end

  def create
    existing = current_user.favorites.find_by(
      place_id: favorite_params[:place_id]
    )

    if existing
      render json: {
        success: false,
        message: "すでに登録されています"
      }, status: :ok
      return
    end

    favorite = current_user.favorites.new(favorite_params)

    if favorite.save
      render json: {
        success: true,
        message: "追加しました"
      }, status: :ok
    else
      render json: {
        success: false,
        errors: favorite.errors.full_messages
      }, status: :unprocessable_entity
    end
  end

  def destroy
    favorite = current_user.favorites.find(params[:id])
    favorite.destroy

    redirect_to favorites_path, notice: "削除しました"
  end

  private

  def favorite_params
    params.require(:favorite).permit(
      :place_id,
      :name,
      :address,
      :rating,
      :photo_reference
    )
  end
end
