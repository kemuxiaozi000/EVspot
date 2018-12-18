Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  root 'top#index', as: :root

    # get
    # ホーム画面
    get 'top' => 'top#index'
    get '' => redirect('top')

    # メンバー画面
    get 'detail/aoki' => 'detail#aoki', as: 'aoki'
    get 'detail/miyamoto' => 'detail#miyamoto', as: 'miyamoto'
    get 'detail/memberInfo' => 'detail#ajax', as: 'ajax'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
