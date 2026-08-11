source "https://rubygems.org"
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby "3.1.4"

gem "rails", "~> 7.0.3", ">= 7.0.3.1"

# Asset pipeline
gem "sprockets-rails"

# PostgreSQL
gem "pg", "~> 1.1"

# Web server
gem "puma", ">= 5.0"

# JavaScript
gem "importmap-rails"
gem "turbo-rails"
gem "stimulus-rails"

# JSON builder
gem "jbuilder"

# Windows timezone
gem "tzinfo-data", platforms: %i[ mingw mswin x64_mingw jruby ]

# Boot speed
gem "bootsnap", require: false

# CSS (Bootstrap用)
gem "sassc-rails", "~> 2.1"

# =========================
# アプリ固有
# =========================
gem "devise"
gem "bootstrap", "~> 5.3"
gem "geocoder"
gem "dotenv-rails"

group :development, :test do
  gem "debug", platforms: %i[ mri mingw x64_mingw ]
end

group :development do
  gem "web-console"
  gem "letter_opener"
end

group :test do
  gem "capybara"
  gem "selenium-webdriver"
end
