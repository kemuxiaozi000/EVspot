class Common < ApplicationRecord
  # IDで検索
  def select_by_id(waitingtime_id)
    Common.where(id: waitingtime_id)
  end

  def select_by_watingtime
    result = Common.where('id = 1')
    result[0].value
  end

  def select_by_chargingtime
    result = Common.where('id = 2')
    result[0].value
  end

  def select_by_spotid
    result = Common.where('id = 3')
    result[0].value
  end

  def select_favorite_spot_ids
    # id4,5,6がお気に入りスポット
    Common.where(id: [4..6]).select('value')
  end
end
