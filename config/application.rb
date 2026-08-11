require_relative "boot"

require "rails/all"

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module App
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 7.0

    # ==========================================
    # 言語・エラーメッセージ統一設定
    # ==========================================

    # デフォルト言語を日本語にする
    config.i18n.default_locale = :ja

    # 利用可能な言語（日本語のみ）
    config.i18n.available_locales = [:ja]

    # locales 配下をすべて自動読み込み
    config.i18n.load_path += Dir[
      Rails.root.join("config", "locales", "**", "*.{rb,yml}")
    ]

    # ==========================================
    # 時刻
    # ==========================================
    # config.time_zone = "Tokyo"
    # config.active_record.default_timezone = :local

    # config.eager_load_paths << Rails.root.join("extras")
  end
end
