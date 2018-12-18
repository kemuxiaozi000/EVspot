# frozen_string_literal: true

# Be sure to restart your server when you modify this file.

# Version of your assets, change this if you want to expire all your assets.
Rails.application.config.assets.version = '1.0'

# Add additional assets to the asset load path.
# Rails.application.config.assets.paths << Emoji.images_path
# Add Yarn node_modules folder to the asset load path.
Rails.application.config.assets.paths << Rails.root.join('node_modules')

# Precompile additional assets.
# application.js, application.css, and all non-JS/CSS in the app/assets
# folder are already added.
# Rails.application.config.assets.precompile += %w( admin.js admin.css )

Rails.application.config.assets.precompile += %w[top.js]
Rails.application.config.assets.precompile += %w[map.js]
Rails.application.config.assets.precompile += %w[map_spot_search.js]
Rails.application.config.assets.precompile += %w[map_route_search.js]
Rails.application.config.assets.precompile += %w[location.js]
Rails.application.config.assets.precompile += %w[spot.js]
Rails.application.config.assets.precompile += %w[suppliers_edit.js]
Rails.application.config.assets.precompile += %w[power_supply_types_edit.js]
Rails.application.config.assets.precompile += %w[spot_detail.js]
Rails.application.config.assets.precompile += %w[mapvisual_silver.js]
Rails.application.config.assets.precompile += %w[login.js]
Rails.application.config.assets.precompile += %w[member.js]
Rails.application.config.assets.precompile += %w[qr_packed.js]
Rails.application.config.assets.precompile += %w[qr_reader.js]
Rails.application.config.assets.precompile += %w[charge_status.js]
Rails.application.config.assets.precompile += %w[charge_complete.js]
Rails.application.config.assets.precompile += %w[supplier.js]
Rails.application.config.assets.precompile += %w[supplier_detail.js]
Rails.application.config.assets.precompile += %w[chargehistory.js]
Rails.application.config.assets.precompile += %w[watingtime.js]
Rails.application.config.assets.precompile += %w[charging.js]
Rails.application.config.assets.precompile += %w[common.js]
Rails.application.config.assets.precompile += %w[coupon.js]
Rails.application.config.assets.precompile += %w[charge_welcome.js]
Rails.application.config.assets.precompile += %w[serviceworker-companion.js]
Rails.application.config.assets.precompile += %w[serviceworker.js]
Rails.application.config.assets.precompile += %w[admin_coupon.js]
Rails.application.config.assets.precompile += %w[admin_spots_edit.js]
Rails.application.config.assets.precompile += %w[admin_userlog.js]
Rails.configuration.assets.precompile += %w[serviceworker.js manifest.json]
Rails.application.config.assets.precompile += %w[supplier_sample3.js]
Rails.application.config.assets.precompile += %w[userbase.js]
