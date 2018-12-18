# frozen_string_literal: true

class SpotDetail < ApplicationRecord
  # IDで検索
  def select_by_id(detail_id)
    SpotDetail.where(id: detail_id)
  end
end
