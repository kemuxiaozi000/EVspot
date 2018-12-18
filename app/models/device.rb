class Device < ApplicationRecord
  def upsert_device(endpoint)
    device = Device.find_or_initialize_by(endpoint: endpoint)
    device
  end

  def select_by_device(endpoint)
    device = Device.where(endpoint: endpoint)
    device
  end
end
