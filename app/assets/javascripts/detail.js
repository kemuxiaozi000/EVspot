// メンバー情報取得
function member() {
    $.ajax({
        url: '/detail/memberInfo',
        data: {name: 'aoki'},
        type: 'GET'
    })
    .done(function(data,textStatus,jqXHR) {
        alert('通信成功!')
        if(data.length > 0) {
            var memberInfo = '<tr><td class="col-xs-4">コメント</td><td class="col-xs-8">' + data["comment"] + '</td></tr>'
                + '<tr><td class="col-xs-4">特技</td><td class="col-xs-8">' + data["skill"] + '</td></tr>'
                + '<tr><td class="col-xs-4">好きなこと</td><td class="col-xs-8">' + data["favorite"] + '</td></tr>'
                + '<tr><td class="col-xs-4">大切なもの</td><td class="col-xs-8">' + data["important"] + '</td></tr>'
                + '<tr><td class="col-xs-4">幸せの軸</td><td class="col-xs-8">' + data["happiness"] + '</td></tr>'
                + '<tr><td class="col-xs-4">あなたの夢</td><td class="col-xs-8">' + data["dream"] + '</td></tr>';
            $('#detail_area').append(memberInfo);
        }
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
        console.log(errorThrown);
    });
}

$('#submit_button').on('click', function() {
    member();
})