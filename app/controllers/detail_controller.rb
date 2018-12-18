class DetailController < ApplicationController
    def aoki
        @nameParam = 'aoki'
        @name = '青木海'
        render 'index'
    end
    def miyamoto
        @nameParam = 'miyamoto'
        @name = '宮本豪'
        render 'index'
    end
    def ajax
        if params[:name] == 'aoki'
            @memberInfo = { 'comment' => '青木コメント',
                'skill' => 'ボイスパーカッション',
                'favorite' => 'サイクリング、ボルダリング',
                'important' => '家族の笑顔',
                'happiness' => '美味しいものを食べる',
                'dream' => 'アイスランド旅行'
            }
        elsif params[:name] == 'miyamoto' 
            @memberInfo = { 'comment' => '？？？',
                'skill' => '？？？',
                'favorite' => '？？？',
                'important' => '？？？',
                'happiness' => '？？？',
                'dream' => '？？？'
            }
            end
        render :json => @memberInfo
    end
end
