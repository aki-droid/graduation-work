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
  # ⭐ 初回表示 or 条件不足なら何もしない
  unless params[:mood].present?
    @google_places = []
    @restaurants = []
    return
  end

  # ⭐ 気分はあるが位置情報がない場合
  if !params[:latitude].present? || !params[:longitude].present?
    @google_places = []
    @restaurants = []
    flash.now[:alert] = '位置情報が取得できませんでした。位置情報を有効にしてください。'
    return
  end

  @latitude  = params[:latitude].to_f
  @longitude = params[:longitude].to_f
  @radius    = (params[:radius]&.to_f || 1.0) * 1000

  # ⭐ Google Places 検索のみ
  if params[:use_google_places] == 'true'
    search_with_google_places
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

  # ⭐ Google Places APIを使った検索(修正版)
  def search_with_google_places
    mood_id = params[:mood].to_i

    Rails.logger.info "🔍 選択された気分ID: #{mood_id}"
    Rails.logger.info "🔍 位置情報: #{@latitude}, #{@longitude}"
    Rails.logger.info "🔍 検索半径: #{@radius}m"

    # Google Places APIサービスを初期化
    service = GooglePlacesService.new

    # Google Places APIで検索
    @google_places = service.search_restaurants(@latitude, @longitude, mood_id, @radius)

    Rails.logger.info "🔍 Google Places検索結果: #{@google_places.length}件"

    # キーワードでさらに絞り込み
    if params[:keyword].present?
      keyword = params[:keyword].strip.downcase
      @google_places = @google_places.select do |place|
        place['name'].downcase.include?(keyword)
      end
    end
  end

  # 🚧 MVP後に実装予定
  # 登録済みレストランから検索
  #def search_registered_restaurants
    #@restaurants = Restaurant.all

    # キーワード検索
    #if params[:keyword].present?
      #keyword = "%#{params[:keyword]}%"
      #@restaurants = @restaurants.where(
        #"name LIKE ? OR address LIKE ? OR description LIKE ?",
       #keyword, keyword, keyword
      #)
    #end

    # カテゴリ検索
    #if params[:category].present?
      #@restaurants = @restaurants.where(category: params[:category])
    #end

    # 距離でフィルタリング
    #if @latitude.present? && @longitude.present?
      #@restaurants = @restaurants.select do |restaurant|
       # next unless restaurant.latitude.present? && restaurant.longitude.present?

        #distance = Geocoder::Calculations.distance_between(
         # [@latitude, @longitude],
          #[restaurant.latitude, restaurant.longitude]
        #)

        #distance <= @radius / 1000.0  # メートルをキロメートルに変換
      #end
    #end

    #@restaurants = @restaurants.sort_by do |restaurant|
     # if @latitude.present? && @longitude.present?
       # restaurant.distance_from(@latitude, @longitude)
      #else
        #0
      #end
    #end
  #end
end
