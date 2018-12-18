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

  def create_by_time(time, spot_id, supplier_id, price)
    volume = time.to_i * 10
    datetime = Time.zone.now.in_time_zone('Asia/Tokyo')
    history = History.create(datetime: datetime, spot_id: spot_id, volume: volume, price: price, supplier_id: supplier_id)
    history
  end

  # IDを条件にレシート情報を取得する
  def select_all_by_id(history_id)
    result = {}
    history_data = History.joins('INNER JOIN spots ON histories.spot_id = spots.id')
                          .joins('INNER JOIN suppliers ON histories.supplier_id = suppliers.id')
                          .joins('INNER JOIN power_supply_types ON suppliers.power_supply_types_id = power_supply_types.id')
                          .select('histories.*,spots.name as spot_name, suppliers.name as supplier_name, suppliers.producing_area,
                                  power_supply_types.name as pst_name, suppliers.photo, suppliers.thanks_comment')
                          .where('histories.id = ?', history_id)
    history_date = ''
    history_date += ymd_date(history_data[0])
    history_date += hms_date(history_data[0])
    result['history_date'] = history_date
    result['spot_name'] = history_data[0].spot_name
    result['volume'] = history_data[0].volume
    result['price'] = history_data[0].price
    result['producing_area'] = history_data[0].producing_area
    result['pst_name'] = history_data[0].pst_name
    result['thanks_comment'] = history_data[0].thanks_comment
    result['photo'] = history_data[0].photo
    result['supplier_name'] = history_data[0].supplier_name
    result
  end
end
