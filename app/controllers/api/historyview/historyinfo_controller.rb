# frozen_string_literal: true

class Api::Historyview::HistoryinfoController < ApplicationController
  protect_from_forgery except: :index

  def index
    Userlog.new.insert(session[:user_name], 'レシート情報画面', '明細取得処理', params.to_s)
    # ID
    history_id = params[:id].to_i
    # 履歴情報取得
    @result = History.new.select_all_by_id(history_id)
    render json: @result
  end
end
