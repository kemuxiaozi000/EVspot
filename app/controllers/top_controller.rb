class TopController < ApplicationController
  def index
    @page_title = 'ZEUS7'
    @title = '自己紹介サイトトップ'
    @members = [{key: 'aoki', name: '青木 海'},
     {key: 'miyamoto', name: '宮本 豪'}]
  end
end