class WebPushController < ApplicationController
  protect_from_forgery except: :index
  def create
    puts params
    device = Device.new.upsert_device(params[:subscription][:endpoint])
    device.endpoint = params[:subscription][:endpoint]
    device.p256dh = params[:subscription][:keys][:p256dh]
    device.auth = params[:subscription][:keys][:auth]
    device.save! if device.changed?
    head :ok
  end

  private

    def device_params
      params.require(:subscription).permit(%i[endpoint p256dh auth])
    end
end
