class AdminSpotsEditController < ApplicationController
  before_action :admin_login_check

  def index
    @page_title = 'スポット管理画面'

    head = 1
    @page = 1
    if params[:page]&.to_i&.positive?
      head = (params[:page].to_i - 1) * 30 + 1
      @page = params[:page]
    end
    tail = head + 29
    @spot_size = (Spot.all.size.to_f / 30).ceil
    @spots = Spot.where(id: head..tail)
    @spot_details_con = SpotDetail.where(id: @spots.select(:detail_id))
    @spot_details = []
    @spots.each_with_index do |spot, i|
      id = spot.detail_id
      @spot_details[i] = if @spot_details_con.find_by(id: id)
                           @spot_details_con.find(id)
                         else
                           SpotDetail.new
                         end
    end
  end
end
