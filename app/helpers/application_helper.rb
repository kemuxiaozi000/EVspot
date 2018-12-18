# frozen_string_literal: true

module ApplicationHelper
  # 充電状態かどうかを取得する
  # @return true:充電状態である(充電残り時間が0の場合で、未精算の場合も含む)、false:充電状態ではない
  def charging?
    session[:charge_start_time].present?
  end

  def get_charge_start_time
    session[:charge_start_time].present? ? session[:charge_start_time] : nil
  end

  # 充電残り時間を取得する
  # @return 充電残り時間(分単位、残りが15分なら'15'を返却、秒単位の余りは切り上げ)
  def get_charge_remaining_minute
    remaining_minute = 0
    start_time = nil
    # セッションから充電開始時間を取得
    charge_start_time = session[:charge_start_time]
    start_time = Time.parse(charge_start_time) if charge_start_time.present?
    if start_time.present?
      # 現在時間と充電開始時間の差から、残り時間を計算(計算結果は秒単位) ※1回あたりの充電時間は30分(=1800秒)固定
      remaining_second = 360 - (Time.now - start_time).to_i
      # 分単位の残り時間を計算
      if remaining_second.positive?
        remaining_minute = (remaining_second / 60).to_i
        # 秒単位で余りがあれば切り上げ
        remaining_minute += 1 if (remaining_second % 60).positive?
      end
    end
    remaining_minute
  end

  # 充電残り時間を取得する
  # @return 充電残り時間(秒単位)
  def get_charge_remaining_second
    remaining_second = 0
    start_time = nil
    # セッションから充電開始時間を取得
    charge_start_time = session[:charge_start_time]
    start_time = Time.parse(charge_start_time) if charge_start_time.present?
    if start_time.present?
      # 現在時間と充電開始時間の差から、残り時間を計算(計算結果は秒単位) ※1回あたりの充電時間は30分(=1800秒)固定
      remaining_second = 360 - (Time.now - start_time).to_i
    end
    # 残り時間が負数になった場合は0扱いにする
    remaining_second = 0 unless remaining_second.positive?
    remaining_second
  end
end
