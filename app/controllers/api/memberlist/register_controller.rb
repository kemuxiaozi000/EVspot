# frozen_string_literal: true

class Api::Memberlist::RegisterController < ApplicationController
  protect_from_forgery except: :index

  def index
    # メールアドレス
    email = params[:email].to_s
    # pass
    password = params[:password].to_s
    # ユーザ登録処理
    saved = Member.new.upsert_by_member(email, password)
    # 登録判定
    result = 0
    result = 1 unless saved
    @result = result
    render json: @result
  end
end
