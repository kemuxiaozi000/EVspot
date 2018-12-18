# frozen_string_literal: true

class Api::Detail::SpotdetailinfoController < ApplicationController
  protect_from_forgery except: :index

  # スポット詳細画面　スポット情報取得処理
  #
  # @param :spot_id スポットID
  #        :supplier_id 提供者ID（空許容・地図画面からの遷移の場合のみ入っている）
  # @return スポットテーブルの構造体
  #         + key:supplier value:提供者テーブルの構造体の配列
  #         + key:coupon value:クーポンテーブルの構造体の配列
  #         + key:detail value:スポット詳細テーブルの構造体の配列
  def index
    Userlog.new.insert(session[:user_name], 'detail', '詳細情報取得', params.to_s)
    # スポットID
    spot_id = params[:spot_id].to_i
    # 提供者ID
    supplier_id = params[:supplier_id].to_i
    # スポット情報の取得
    @result = Spot.new.select_all_by_id_for_detail(spot_id, supplier_id)
    render json: @result
  end
end
