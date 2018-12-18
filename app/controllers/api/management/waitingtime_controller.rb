# frozen_string_literal: true

class Api::Management::WaitingtimeController < ApplicationController
  protect_from_forgery except: :index

  def upsert
    id = 1
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
