# frozen_string_literal: true

class MapController < ApplicationController
  def index
    @page_title = '充電スポット - これからEVドライブ'
    # 目的地
    @destination = params[:destination].to_s
    # lat（空許容）
    @spot_lat = params[:lat].nil? ? '' : params[:lat].to_f
    # lon（空許容）
    @spot_lon = params[:lon].nil? ? '' : params[:lon].to_f
  end
end
