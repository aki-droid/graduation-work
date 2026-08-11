FROM ruby:3.1.4

# 必要なパッケージをインストール
RUN apt-get update -qq && apt-get install -y \
  nodejs \
  postgresql-client \
  yarn

# 作業ディレクトリを設定
WORKDIR /app

# GemfileとGemfile.lockをコピー
COPY Gemfile* ./

# gemをインストール
RUN bundle install

# アプリケーションのソースをコピー
COPY . .

# ポート3000を公開
EXPOSE 3000

# サーバー起動コマンド
CMD ["rails", "server", "-b", "0.0.0.0"]
