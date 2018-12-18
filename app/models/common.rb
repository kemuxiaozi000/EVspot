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
end
