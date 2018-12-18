# frozen_string_literal: true

class SpotDetailController < ApplicationController
  def index
    @page_title = 'スポット詳細 - これからEVドライブ'
    # スポット詳細
    @spot_id = params[:spot_id]
  end
end
