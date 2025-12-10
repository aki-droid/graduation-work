class MoodsController < ApplicationController
  # 気分選択画面
  def index
    @moods = Mood.all
  end

  # 気分を選択する処理
  def select
    mood_id = params[:mood_id]
    mood = Mood.find(mood_id)
    
    if mood
      # セッションに保存
      session[:selected_mood_id] = mood_id
      
      # ログインしている場合はユーザーにも保存(将来実装)
      # if current_user
      #   current_user.update(selected_mood_id: mood_id)
      # end
      
      render json: { success: true, mood: mood }
    else
      render json: { success: false, error: '気分が見つかりません' }, status: :not_found
    end
  end
end
