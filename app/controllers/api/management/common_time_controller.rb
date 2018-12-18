# frozen_string_literal: true

class Api::Management::CommonTimeController < ApplicationController
  protect_from_forgery except: :index

  def index
    # ID
    id = params[:id]
    @result = Common.new.select_by_id(id)
    render json: @result
  end

  def upsert
    id = params[:id]
    @result = Common.find_or_initialize_by(id: id)
    @result.value = params[:value]
    if @result.new_record?
      @result.save
    else
      @result = Common.where(id: id).update(
        value: @result.value
      )
    end
    render json: @result
  end
end
