Geocoder.configure(
  timeout: 10,
  units: :km,
  distances: :spherical,
  calculations: :spherical,

  # ← これが超重要！（SQL の bearing 計算を完全に削除）
  calc_bearing: false,

  use_https: true,

  always_raise: [
    Geocoder::OverQueryLimitError,
    Geocoder::RequestDenied,
    Geocoder::InvalidRequest,
    Geocoder::InvalidApiKey
  ]
)
