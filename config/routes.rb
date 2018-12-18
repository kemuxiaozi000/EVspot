# frozen_string_literal: true

Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  root 'login#index', as: :root

  # get
  # ホーム画面
  get 'login' => 'login#index'
  get '' => redirect('login')
  # Top画面
  get 'top' => 'top#index'

  # 会員登録画面
  get 'member' => 'member#index'

  # 充電スポット画面
  get 'map' => 'map#index'

  # 詳細画面
  get 'detail' => 'detail#index'

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
      namespace :spotinfo do
        post '/index', action: 'index'
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
  end
end
