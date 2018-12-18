# frozen_string_literal: true

class Member < ApplicationRecord
  # ユーザーテーブルの登録
  def user_find(email, password)
    Member.find_by(email_address: email, password: password)
  end

  # ユーザーテーブルの登録
  def upsert_by_member(email, password)
    puts 'upsert_by_member'
    # 同一のemail_addressが存在する場合は取得、しなければ新規作成(未保存)
    member = Member.find_or_initialize_by(email_address: email)
    if member.new_record?
      # 新規作成の場合は保存
      member.email_address = email
      member.password = password
      return member.save
    else
      member = Member.where(email_address: email).update(email_address: email, password: password)
      return member
    end
  end
end
