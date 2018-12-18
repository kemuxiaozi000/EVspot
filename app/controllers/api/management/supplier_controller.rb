# frozen_string_literal: true

class Api::Management::SupplierController < ApplicationController
  protect_from_forgery except: :index

  def index
    # ID
    id = params[:id]

    @result = Supplier.new.select_by_id(id)
    render json: @result
  end

  def upsert
    # ID
    id = params[:id].to_i
    result = set_result_param(id, params)
    if result.new_record?
      result.save
    else
      update(id, result)
    end
    render json: @result
  end

  def set_result_param(id, params)
    result = Supplier.find_or_initialize_by(id: id)
    result.name = params[:name]
    result.value = params[:value].to_i
    result.power_supply_types_id = params[:power_supply_types_id].to_i
    result.producing_area = params[:producing_area]
    result.origin = params[:origin]
    result.comment = params[:comment]
    result.thanks_comment = params[:thanksComment]
    result
  end

  def update(id, result)
    Supplier.where(id: id).update(
      name: result.name,
      value: result.value,
      power_supply_types_id: result.power_supply_types_id,
      producing_area: result.producing_area,
      origin: result.origin,
      comment: result.comment,
      thanks_comment: result.thanks_comment
    )
  end

  def destroy
    id = params[:id].to_i
    supplier = Supplier.find_or_initialize_by(id: id)
    supplier.destroy
  end
end
