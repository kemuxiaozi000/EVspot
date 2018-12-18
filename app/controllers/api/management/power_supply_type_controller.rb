# frozen_string_literal: true

class Api::Management::PowerSupplyTypeController < ApplicationController
  before_action :admin_login_check
  protect_from_forgery except: :index

  def index
    # ID
    id = params[:id]

    @result = PowerSupplyType.new.select_by_id(id)
    render json: @result
  end

  def upsert
    # ID
    id = params[:id].to_i
    @result = PowerSupplyType.find_or_initialize_by(id: id)
    @result.name = params[:name]
    if @result.new_record?
      @result.save
    else
      PowerSupplyType.where(id: id).update(
        name: @result.name
      )
    end
    render json: @result
  end

  def destroy
    # ID
    id = params[:id].to_i
    @result = PowerSupplyType.find_or_initialize_by(id: id)
    @result.destroy
  end
end
