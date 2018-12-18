# frozen_string_literal: true

class Geocode < ApplicationRecord
  geocoded_by :address
  before_validation :geocode, if: :address_changed?

  # ジオテーブルの登録
  def upsert_by_address(address)
    puts 'upsert address'

    # 同一のnameが存在する場合は取得、しなければ新規作成(未保存)
    geocode = Geocode.find_or_initialize_by(address: address)
    if geocode.new_record?
      # 新規作成の場合は保存
      geocode.save
    end
    geocode
  end
end
