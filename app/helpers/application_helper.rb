# frozen_string_literal: true

module ApplicationHelper
  # 充電状態かどうかを取得する
  # @return true:充電状態である(充電残り時間が0の場合で、未精算の場合も含む)、false:充電状態ではない
  def charging?
    session[:charge_start_time].present?
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
      # 現在時間と充電開始時間の差から、残り時間を計算(計算結果は秒単位)
      # ベースとなる充電時間はDBから取得する(単位は分)
      base_time = Common.find(2).value.to_i * 60
      remaining_second = base_time - (Time.zone.now.in_time_zone('Asia/Tokyo') - start_time).to_i
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
      # 現在時間と充電開始時間の差から、残り時間を計算(計算結果は秒単位)
      # ベースとなる充電時間はDBから取得する(単位は分)
      base_time = Common.find(2).value.to_i * 60
      remaining_second = base_time - (Time.zone.now.in_time_zone('Asia/Tokyo') - start_time).to_i
    end
    # 残り時間が負数になった場合は0扱いにする
    remaining_second = 0 unless remaining_second.positive?
    remaining_second
  end

  # 充電残り時間のベースとなる時間を取得する
  # @return 充電残り時間のベース時間(分単位)
  def get_charge_remaining_base_minute
    Common.find(2).value.to_i
  end

  # 生産者名を取得する
  # @return 生産者名(未設定の場合は'我が家の電気')
  def get_supplier_name
    session[:supplier_name].present? ? session[:supplier_name] : '我が家の電気'
  end

  # 順番予約中かどうかを取得する
  # @return true:順番予約中である false:順番予約中ではない
  def reserving?
    session[:reservation_time].present?
  end

  def get_reserve_remaining_time
    # セッションから順番予約開始時間を取得
    reservation_time = session[:reservation_time]
    remaining_time = Time.parse(reservation_time) if reservation_time.present?
    if remaining_time.present?
      # 現在時間と順番予約開始時間の差から、残り時間を計算(計算は秒単位で行う)
      # ベースとなる時間はDBから取得する(単位は分)
      base_time = Common.find(1).value.to_i * 60
      remaining_time += base_time
    end
    remaining_time
  end

  # 順番予約残り時間(=充電スポットが利用可能になるまでの時間)を取得する
  # @return 順番予約残り時間(分単位、残りが15分なら'15'を返却、秒単位の余りは切り上げ)
  def get_reserve_remaining_minute
    remaining_minute = 0
    start_time = nil
    # セッションから順番予約開始時間を取得
    reservation_time = session[:reservation_time]
    start_time = Time.parse(reservation_time) if reservation_time.present?
    if start_time.present?
      # 現在時間と順番予約開始時間の差から、残り時間を計算(計算は秒単位で行う)
      # ベースとなる時間はDBから取得する(単位は分)
      base_time = Common.find(1).value.to_i * 60
      remaining_second = base_time - (Time.zone.now.in_time_zone('Asia/Tokyo') - start_time).to_i
      # 分単位の残り時間を計算
      if remaining_second.positive?
        remaining_minute = (remaining_second / 60).to_i
        # 秒単位で余りがあれば切り上げ
        remaining_minute += 1 if (remaining_second % 60).positive?
      end
    end
    remaining_minute
  end

  # 順番予約を行う仮のスポットIDを取得する
  # @return スポットID
  def get_temporary_spot_id
    Common.find(3).value.to_i
  end

  # 待ち時間のベースを取得する
  # @return 待ち時間(分単位)
  def get_reserve_remaining_base_minute
    Common.find(1).value.to_i
  end

  # 管理者関連のページかどうかを判定する
  # @params controller_name コントローラ名
  # @return true:管理者関連のページである false:管理者関連のページ以外である
  def admin_page?(controller_name)
    case controller_name
    when 'admin_login', 'admin_coupon', 'admin_spots_edit', 'admin_userlog',
      'power_supply_types_edit', 'suppliers_edit', 'common_edit'
      true
    else
      false
    end
  end

  # 充電可能開始時間を取得する
  # @return 充電可能開始時間
  def get_charge_start_time
    waiting_time = Common.new.select_by_watingtime
    if waiting_time.to_i.positive?
      start_time = Time.zone.now.in_time_zone('Asia/Tokyo') + waiting_time.to_i * 60
      charge_start_time = start_time.strftime('%H:%M').to_s
    else
      charge_start_time = '充電可'
    end
    charge_start_time
  end
end
