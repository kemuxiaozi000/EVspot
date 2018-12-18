# frozen_string_literal: true

class Api::Charge::ReservationController < ApplicationController
  protect_from_forgery except: :index

  def index
    !session[:reservation_time].present? ? session[:reservation_time] = Time.now.to_s : nil
  end
end
