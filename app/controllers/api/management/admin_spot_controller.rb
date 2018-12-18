# frozen_string_literal: true

class Api::Management::AdminSpotController < ApplicationController
  before_action :admin_login_check
  protect_from_forgery except: :index

  def index
    # ID
    id = params[:id]
    @result = Spot.new.select_by_id(id)
    # @result = Spot.new.select_all_by_id_for_spot_detail(id)
    # @result = Spot.new.select_by_id(id).joins(:spot_details).select("spots.*, spot_details.*")

    # @result_details = SpotDetail.select_by_id(id: @result.detail_id)

    render json: @result

    # render json: @result_details
  end

  def index2
    # ID
    id = params[:id]
    spot_data = Spot.find(id)
    id_detail = spot_data.detail_id
    @result = SpotDetail.new.select_by_id(id_detail)

    render json: @result
  end

  def update_spot(spot_model)
    Spot.where(id: spot_model.id).update(
      name: spot_model.name,
      lat: spot_model.lat,
      lon: spot_model.lon,
      coupon_id: spot_model.coupon_id,
      supplier_id: spot_model.supplier_id
    )
  end

  def update_spotdetail(spot_model, detail)
    SpotDetail.where(id: spot_model.detail_id).update(
      address: detail.address,
      week: detail.week,
      sat: detail.sat,
      sun: detail.sun,
      holiday: detail.holiday,
      sales_remarkes: detail.sales_remarkes,
      tel: detail.tel,
      remarks: detail.remarks,
      stand_1: detail.stand_1,
      stand_2: detail.stand_2,
      stand_3: detail.stand_3,
      additional_information: detail.additional_information,
      charge_types: detail.charge_types,
      facility_information: detail.facility_information,
      nearby_information: detail.nearby_information,
      supported_services: detail.supported_services,
      crowded_time_zone: detail.crowded_time_zone
    )
  end

  def spot_create_or_update(spot_model, detail)
    if spot_model.new_record? || detail.new_record?
      spot_model.save
      detail.save
    else
      update_spot(spot_model)
      update_spotdetail(spot_model, detail)
    end
  end

  def into_param_spot(params, id)
    spot = Spot.find_or_initialize_by(id: id)
    spot.name = params[:name]
    spot.lat = params[:lat]
    spot.lon = params[:lon]
    spot.coupon_id = params[:coupon_id]
    spot.supplier_id = params[:supplier_id]
    spot.detail_id = params[:detail_id]
    spot
  end

  def into_param_detail(params, id)
    detail = SpotDetail.find_or_initialize_by(id: id)
    detail.address = params[:address]
    detail.sat = params[:sat]
    detail.sun = params[:sun]
    detail.holiday = params[:holiday]
    detail.sales_remarkes = params[:sales_remarkes]
    detail.tel = params[:tel]
    detail.remarks = params[:remarks]
    detail.stand_1 = params[:stand_1]
    detail.stand_2 = params[:stand_2]
    detail.stand_3 = params[:stand_3]
    detail.additional_information = params[:additional_information]
    detail.charge_types = params[:charge_types]
    detail.facility_information = params[:facility_information]
    detail.nearby_information = params[:nearby_information]
    detail.supported_services = params[:supported_services]
    detail.crowded_time_zone = params[:crowded_time_zone]
    detail
  end

  def upsert
    # ID
    id = params[:id].to_i

    spot = into_param_spot(params, id)
    detail = into_param_detail(params, spot.detail_id)

    result = spot_create_or_update(spot, detail)
    render json: result
  end

  def destroy
    id = params[:id].to_i
    spot = Spot.find_or_initialize_by(id: id)
    detail = SpotDetail.find_or_initialize_by(id: spot.detail_id)
    spot.destroy
    detail.destroy
  end
end
