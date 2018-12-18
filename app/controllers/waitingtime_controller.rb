# frozen_string_literal: true

class WaitingtimeController < ApplicationController
  def index
    @page_title = '待ち時間管理'
    id = 1
    @waitingtime = Common.new.select_by_id(id)
  end
end
