require 'webpush'
# One-time, on the server
vapid_key = Webpush.generate_key

# Save these in your application server settings
puts vapid_key.public_key # 公開鍵
puts vapid_key.private_key # 秘密鍵
