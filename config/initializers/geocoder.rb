Geocoder.configure(
  timeout: 10,
  units: :km,
  distances: :spherical,
  calculations: :spherical,

  calc_bearing: false,

  use_https: true,

  always_raise: [
    Geocoder::OverQueryLimitError,
    Geocoder::RequestDenied,
    Geocoder::InvalidRequest,
    Geocoder::InvalidApiKey
  ]
)
