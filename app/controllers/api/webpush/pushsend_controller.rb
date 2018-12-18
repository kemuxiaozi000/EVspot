# frozen_string_literal: true

class Api::Webpush::PushsendController < ApplicationController
  protect_from_forgery except: :index

  def index
    endpoint = params[:subscription][:endpoint]
    devices = Device.new.select_by_device(endpoint)
    devices.each do |device|
      webpush device, params[:message].to_s
    end
    head :ok
  end

  def webpush(device, message)
    Webpush.payload_send(
      message: message,
      endpoint: device.endpoint,
      p256dh: device.p256dh,
      auth: device.auth,
      ttl: 24 * 60 * 60,
      vapid: {
        public_key: ENV['VAPID_PUBLIC_KEY'],
        private_key: ENV['VAPID_PRIVATE_KEY']
      }
    )
  end
end
