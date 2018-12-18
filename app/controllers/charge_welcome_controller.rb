# frozen_string_literal: true

class ChargeWelcomeController < ApplicationController
  def index
    @page_title = '認証完了 - これからEVドライブ'
    @spot_name = Spot.find_by(id: params[:spot_id])&.name
  end
end