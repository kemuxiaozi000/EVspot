# frozen_string_literal: true

class Api::Charge::ReservationController < ApplicationController
  protect_from_forgery except: :index

  def index
    !session[:reservation_time].present? ? session[:reservation_time] = Time.zone.now.in_time_zone('Asia/Tokyo').to_s : nil
  end
end
