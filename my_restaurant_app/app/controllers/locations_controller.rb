class LocationsController < ApplicationController
  # CSRF保護を一時的に無効化（JavaScriptからのPOSTリクエストのため）
  skip_before_action :verify_authenticity_token, only: [:create]

  # 位置情報の一覧を表示
  def index
    @locations = Location.order(created_at: :desc).limit(10)
    @location = Location.last
  end

  # 位置情報を保存
  def create
    @location = Location.new(location_params)

    if @location.save
      render json: {
        status: 'success',
        message: '位置情報を保存しました',
        location: @location
      }, status: :created
    else
      render json: {
        status: 'error',
        message: '位置情報の保存に失敗しました',
        errors: @location.errors.full_messages
      }, status: :unprocessable_entity
    end
  end

  private

  def location_params
    params.require(:location).permit(:latitude, :longitude, :accuracy)
  end
end
