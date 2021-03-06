# frozen_string_literal: true

Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  root 'userbase#index', as: :root

  # get
  # ホーム画面
  get 'userbase' => 'userbase#index'
  get '' => redirect('userbase')
  # Top画面
  get 'top' => 'top#index'

  # 行き先を探す画面
  get 'distinations' => 'distinations#index'

  # Spot一覧表示画面
  get 'spot' => 'spot#index'

  # 充電選択画面
  get 'charging' => 'charging#index', as: 'charging'

  # QRコード認証画面
  get 'qrreader' => 'qrreader#index'

  # 電源種別選択画面
  get 'power_supply_types' => 'power_supply_types#index'

  # 供給情報画面
  get 'supplier' => 'supplier#index'

  # 供給者管理画面
  get 'suppliers_edit' => 'suppliers_edit#index', as: 'suppliers_edit'

  # 充電履歴画面
  get 'charge_history' => 'charge_history#index'

  # 充電スポット認証画面
  get 'charge_authenticate' => 'charge_authenticate#index'

  # 充電スポット充電開始画面
  get 'charge_welcome/index'
  get 'charge_welcome' => 'charge_welcome#index', as: 'charge_welcome'

  # 充電スポット充電中画面
  get 'charge_status/index'
  get 'charge_status' => 'charge_status#index', as: 'charge_status'

  # 充電スポット充電完了画面
  get 'charge_complete/index'
  get 'charge_complete' => 'charge_complete#index', as: 'charge_complete'

  # 会員登録画面
  get 'member' => 'member#index'

  # 充電スポット画面
  get 'map' => 'map#index'

  # 詳細画面
  get 'detail' => 'detail#index'

  # クーポン画面
  get 'coupon' => 'coupon#index'

  # 暇つぶしメニュー画面
  get 'passtime' => 'passtime#index'

  # 充電管理画面
  get 'suppliers_edit' => 'suppliers_edit#index'

  # 共通管理画面
  get 'common_edit' => 'common_edit#index'

  resources :web_push, only: [:create]
  # スポット詳細画面
  get 'spot_detail' => 'spot_detail#index', as: 'spot_detail'

  # 供給者詳細画面
  get 'supplier_detail' => 'supplier_detail#index', as: 'supplier_detail'

  # でんきリスト(供給情報画面)のサンプル画面
  get 'supplier_sample1' => 'supplier_sample1#index'
  get 'supplier_sample2' => 'supplier_sample2#index'
  get 'supplier_sample3' => 'supplier_sample3#index'

  # 管理者ログイン画面
  get 'admin_login' => 'admin_login#index'
  post 'admin_login' => 'admin_login#login'

  # 電源種別管理画面
  get 'power_supply_types_edit' => 'power_supply_types_edit#index'

  # 管理者クーポン画面
  get 'admin_coupon' => 'admin_coupon#index'

  # 管理者スポット画面
  get 'admin_spots_edit' => 'admin_spots_edit#index'
  get 'admin_spots_edit/:page' => 'admin_spots_edit#index'

  # 管理者ログ確認画面
  get 'admin_userlog' => 'admin_userlog#index'

  # DBアクセス
  namespace :api do
    # トップ画面
    namespace :top, format: 'json' do
      # クーポン情報を取得する処理
      namespace :couponinfo do
        post '/index', action: 'index'
      end
    end
    # 充電スポット画面
    namespace :map, format: 'json' do
      # 充電スポットを取得する処理
      namespace :spotinfolatlon do
        post '/index', action: 'index'
        post '/read', action: 'read'
      end
    end
    # 詳細画面
    namespace :detail, format: 'json' do
      # 充電スポットを取得する処理
      namespace :spotdetailinfo do
        post '/index', action: 'index'
      end
    end
    # ログイン画面
    namespace :login, format: 'json' do
      # 充電スポットを取得する処理
      namespace :usercheck do
        post '/index', action: 'index'
      end
    end
    # 会員登録画面
    namespace :memberlist, format: 'json' do
      # 充電スポットを取得する処理
      namespace :register do
        post '/index', action: 'index'
      end
    end
    # 供給画面
    namespace :supplierlist, format: 'json' do
      # 供給情報を取得する処理
      namespace :supplierinfo do
        post '/index', action: 'index'
      end
      # 供給情報を取得する処理
      namespace :supplierselect do
        post '/index', action: 'index'
      end
    end
    # 充電管理画面
    namespace :management, format: 'json' do
      # 選ぶ供給情報を取得する処理
      namespace :supplier do
        post '/index', action: 'index'
        post '/upsert', action: 'upsert'
        post '/destroy', action: 'destroy'
      end
      # 待ち時間/充電時間を取得する処理
      namespace :common_time do
        post '/index', action: 'index'
        post '/upsert', action: 'upsert'
      end
      # クーポンを取得する処理
      namespace :admin_coupon do
        post '/index', action: 'index'
        post '/upsert', action: 'upsert'
        post '/destroy', action: 'destroy'
      end
      # スポットの追加・修正・削除処理
      namespace :admin_spot do
        post '/index', action: 'index'
        post '/index2', action: 'index2'
        post '/upsert', action: 'upsert'
        post '/destroy', action: 'destroy'
      end
      # ログ情報を取得する処理
      namespace :admin_user_log do
        post '/index', action: 'index'
      end
    end
    # 認証画面
    namespace :authenticate, format: 'json' do
      # スポット情報を取得する処理
      namespace :spotinfo do
        post '/index', action: 'index'
      end
    end
    # 充電画面
    namespace :charge, format: 'json' do
      # 明細情報を取得する処理
      namespace :historyinfo do
        post '/index', action: 'index'
      end
      # 予約
      namespace :reservation do
        post '/index', action: 'index'
      end
      # 順番予約
      namespace :reservation_time do
        post '/index', action: 'index'
      end
    end
    # レシート情報画面
    namespace :historyview, format: 'json' do
      # 選ぶ供給情報を取得する処理
      namespace :historyinfo do
        post '/index', action: 'index'
      end
    end
    # クーポン画面
    namespace :couponlist, format: 'json' do
      # 選ぶ供給情報を取得する処理
      namespace :couponinfo do
        post '/index', action: 'index'
      end
    end
    # push送信処理
    namespace :webpush, format: 'json' do
      # 選ぶ供給情報を取得する処理
      namespace :pushsend do
        post '/index', action: 'index'
      end
    end
    # 電源種別管理画面
    namespace :management, format: 'json' do
      # 電源種別情報を取得する処理
      namespace :power_supply_type do
        post '/index', action: 'index'
        post '/upsert', action: 'upsert'
        post '/destroy', action: 'destroy'
      end
    end
  end
end
