require 'csv'

CSV.generate do |csv|
  csv_column_names = %w[id datetime user_name screen action parameter created_at updated_at]
  csv << csv_column_names
  @user_logs.each do |user_log|
    csv_column_values = [
      user_log.id,
      user_log.datetime,
      user_log.user_name,
      user_log.screen,
      user_log.action,
      user_log.parametar,
      user_log.created_at,
      user_log.updated_at
    ]
    csv << csv_column_values
  end
end
