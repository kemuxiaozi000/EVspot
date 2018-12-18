# frozen_string_literal: true

class ChargeHistoryController < ApplicationController
  def index
    @page_title = '充電履歴 - これからEVドライブ'
    # 充電履歴の取得
    @history_list = History.new.select_all
  end
end
