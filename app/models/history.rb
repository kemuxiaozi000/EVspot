class History < ApplicationRecord
  def select_all
    history_data = History.joins('INNER JOIN spots ON histories.spot_id = spots.id')
                          .select('histories.*, spots.name as spot_name')
                          .order('datetime DESC')
    result = history_list(history_data)
    result
  end

  def history_list(history_data)
    result_arr = []
    history_data.each do |data|
      history_date = ''
      history_date += ymd_date(data)
      history_date += hms_date(data)
      tmp_hash = {}
      tmp_hash['datetime'] = history_date
      tmp_hash['spot_name'] = data.spot_name
      tmp_hash['volume'] = data.volume
      tmp_hash['price'] = data.price
      tmp_hash['id'] = data.id
      result_arr.push(tmp_hash)
    end
    result_arr
  end

  def ymd_date(data)
    data.datetime.year.to_s + '/' + data.datetime.month.to_s + '/' + data.datetime.day.to_s + ' '
  end

  def hms_date(data)
    data.datetime.hour.to_s.rjust(2, '0') + ':' + data.datetime.min.to_s.rjust(2, '0') + ':' + data.datetime.sec.to_s.rjust(2, '0')
  end

  def create_by_time(time, spot_id)
    volume = time.to_i * 10
    datetime = Time.now
    price = time.to_i * 30
    history = History.create(datetime: datetime, spot_id: spot_id, volume: volume, price: price)
    history
  end

  # IDを条件にレシート情報を取得する
  def select_all_by_id(history_id)
    result = {}
    history_data = History.joins('INNER JOIN spots ON histories.spot_id = spots.id')
                          .select('histories.*, spots.name as spot_name, spots.supplier_id')
                          .where('histories.id = ?', history_id)
    result['spot_name'] = history_data[0].spot_name
    history_date = ''
    history_date += ymd_date(history_data[0])
    history_date += hms_date(history_data[0])
    result['datetime'] = history_date
    result['volume'] = history_data[0].volume
    result['price'] = history_data[0].price
    if history_data[0].supplier_id != ''
      supply_data = supply_info(history_data)
      unless supply_data.empty?
        result['producing_area'] = supply_data[0].producing_area
        result['pst_name'] = supply_data[0].pst_name
      end
    end
    result
  end

  def supply_info(history_data)
    supplier_arr = history_data[0].supplier_id
    supplier_arr = supplier_arr.split(':')
    supplier_id = supplier_arr[0]
    supply_data = Supplier.joins('INNER JOIN power_supply_types ON suppliers.power_supply_types_id = power_supply_types.id')
                          .select('suppliers.producing_area as producing_area, power_supply_types.name as pst_name')
                          .where('suppliers.id = ?', supplier_id)
    supply_data
  end
end
