class GooglePlacesService
  API_KEY = ENV['GOOGLE_PLACES_API_KEY']
  BASE_URL = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json'
  PHOTO_BASE_URL = 'https://maps.googleapis.com/maps/api/place/photo'

  def search_restaurants(latitude, longitude, mood_id, radius)
    mood = Mood.find_by(id: mood_id)
    
    unless mood
      Rails.logger.error "❌ Mood not found: #{mood_id}"
      return []
    end

    Rails.logger.info "🔍 検索パラメータ: 気分=#{mood.name}, 位置=(#{latitude}, #{longitude}), 半径=#{radius}m"

    # Google Places APIのキーワードを取得
    keywords = mood.google_keywords.split(',').map(&:strip)
    Rails.logger.info "🔍 検索キーワード: #{keywords.join(', ')}"

    all_results = []

    # 各キーワードで検索
    keywords.each do |keyword|
      results = search_by_keyword(latitude, longitude, keyword, radius)
      all_results.concat(results)
    end

    # 重複を削除（place_idで判定）
    unique_results = all_results.uniq { |r| r['place_id'] }
    
    Rails.logger.info "✅ 検索完了: #{unique_results.length}件"
    
    unique_results
  end

  private

  def search_by_keyword(latitude, longitude, keyword, radius)
    params = {
      location: "#{latitude},#{longitude}",
      radius: radius,
      type: 'restaurant',
      keyword: keyword,
      key: API_KEY,
      language: 'ja'
    }

    uri = URI(BASE_URL)
    uri.query = URI.encode_www_form(params)

    Rails.logger.info "🌐 API リクエスト: #{keyword}"

    begin
      response = Net::HTTP.get_response(uri)
      
      unless response.is_a?(Net::HTTPSuccess)
        Rails.logger.error "❌ API エラー: #{response.code} - #{response.message}"
        return []
      end

      data = JSON.parse(response.body)

      if data['status'] != 'OK' && data['status'] != 'ZERO_RESULTS'
        Rails.logger.error "❌ Google Places API エラー: #{data['status']}"
        return []
      end

      results = data['results'] || []
      Rails.logger.info "✅ #{keyword}: #{results.length}件取得"

      # 結果を整形
      format_results(results, latitude, longitude)

    rescue StandardError => e
      Rails.logger.error "❌ 検索エラー: #{e.message}"
      Rails.logger.error e.backtrace.join("\n")
      []
    end
  end

  def format_results(results, user_lat, user_lng)
    results.map do |place|
      location = place.dig('geometry', 'location')
      next unless location

      # 距離を計算
      distance = calculate_distance(
        user_lat, user_lng,
        location['lat'], location['lng']
      )

      # 写真URLを取得
      photo_url = get_photo_url(place['photos']&.first)

      {
        place_id: place['place_id'],
        name: place['name'],
        address: place['vicinity'],
        rating: place['rating'],
        user_ratings_total: place['user_ratings_total'],
        photo_url: photo_url,
        distance: distance,
        open_now: place.dig('opening_hours', 'open_now'),
        latitude: location['lat'],
        longitude: location['lng']
      }
    end.compact
  end

  def get_photo_url(photo)
    return nil unless photo && photo['photo_reference']

    params = {
      maxwidth: 400,
      photo_reference: photo['photo_reference'],
      key: API_KEY
    }

    uri = URI(PHOTO_BASE_URL)
    uri.query = URI.encode_www_form(params)
    uri.to_s
  end

  def calculate_distance(lat1, lng1, lat2, lng2)
    # Haversine formula で距離を計算（km単位）
    rad_per_deg = Math::PI / 180
    earth_radius = 6371 # km

    dlat = (lat2 - lat1) * rad_per_deg
    dlng = (lng2 - lng1) * rad_per_deg

    a = Math.sin(dlat / 2)**2 +
        Math.cos(lat1 * rad_per_deg) *
        Math.cos(lat2 * rad_per_deg) *
        Math.sin(dlng / 2)**2

    c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    
    (earth_radius * c).round(2)
  end
end
