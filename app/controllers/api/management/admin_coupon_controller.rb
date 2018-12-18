# frozen_string_literal: true

class Api::Management::AdminCouponController < ApplicationController
  before_action :admin_login_check
  protect_from_forgery except: :index

  def index
    # ID
    id = params[:id].to_i
    @result = Coupon.new.select_by_id(id)
    render json: @result
  end

  def coupon_create_or_update(coupon_model)
    if coupon_model.new_record?
      coupon_model.save
    else
      Coupon.where(id: coupon_model.id).update(
        title: coupon_model.title,
        message: coupon_model.message,
        from_date: coupon_model.from_date,
        to_date: coupon_model.to_date
      )
    end

    coupon_model
  end

  def upsert
    # ID
    id = params[:id].to_i
    coupon = Coupon.find_or_initialize_by(id: id)
    coupon.title = params[:title]
    coupon.message = params[:message]
    coupon.from_date = params[:from_date]
    coupon.to_date = params[:to_date]

    result = coupon_create_or_update(coupon)
    render json: result
  end

  def destroy
    id = params[:id].to_i
    coupon = Coupon.find_or_initialize_by(id: id)
    coupon.destroy
  end
end
