class Api::Device::WebPushDeviceController < ApplicationController
  protect_from_forgery except: :index
  def create
    device = devices.find_or_initialize_by endpoint: params[:subscription][:endpoint]
    device.attributes = device_params
    device.save! if device.changed?
    head :ok
  end

  private

    def device_params
      params.require(:subscription).permit(%i[endpoint p256dh auth])
    end
end
