class AddColumnToSpotDetails < ActiveRecord::Migration[5.2]
  def change
    add_column :spot_details, :additional_information, :string # 付帯情報(中身はコロン区切りで複数可)
    add_column :spot_details, :charge_types, :string # 機器種別(中身はコロン区切りで複数可)
    add_column :spot_details, :facility_information, :string # 店舗情報(中身はコロン区切りで複数可)
    add_column :spot_details, :nearby_information, :string # 周辺情報(中身はコロン区切りで複数可)
    add_column :spot_details, :supported_services, :string # 対象サービス(中身はコロン区切りで複数可)
    add_column :spot_details, :crowded_time_zone, :string # 混雑時間帯(中身はコロン区切りで複数可)
  end
end
