$(document).ready(function () {
  // 供給者の絞り込みボタンクリック時処理
  $('.supplier_search_form').submit(function (event) {
    // HTMLでの送信をキャンセル
    event.preventDefault();

    $.ajax({
      url: '/api/supplierlist/supplierinfo/index',
      type: 'post',
      data: $('.supplier_search_form').serialize() // フォーム内のデータをすべて送信
    })
      .done(function (data, textStatus, jqXHR) {
        // HTML作成
        var content = '';
        if (data.length > 0) {
          // 供給者情報をレコードごとに表示する
          for (var key in data) {
            content += '<div class="col-xs-12">';
            content += '<div class="box box-info">';
            content += '<div class="box-body">';
            content += '<a href="supplier_detail?supplier_id=' + data[key].id + '">'
            content += '<ul class="products-list product-list-in-box charging_select" id="' + data[key].id + '" title="' + data[key].name + '">';
            content += '<li class="item" style="position: relative;">';

            content += '<figure class="product-img">'
            // 発電画像設定処理
            content += '<img src="' + data[key].electric_photo + '" class="img-fluid border border-primary unzoomed">';
            content += '<figcaption class="text-center h6" style="margin: 0px;">' + data[key].origin + '</figcaption>';
            content += '</figure>';

            content += '<figure class="product-img">'
            // 個人画像設定処理
            content += '<img src="' + data[key].photo + '" class="img-fluid border border-primary unzoomed">';
            content += '<figcaption class="text-center h6" style="margin: 0px;">' + data[key].name + '</figcaption>';
            content += '</figure>';

            content += '<div class="product-info" style="padding-left: 50px;">';

            content += '<span class="product-title">';
            content += '<strong style="font-size : middle">' + data[key].comment + '</strong>';
            content += '</span>';

            content += '<div class="label label-info pull-right" style="position: absolute; bottom: 10px; right: 0;">';
            content += '<strong style="font-size : medium" >' + data[key].value + '円</strong>';
            content += '</div>';

            content += '</br>';

            content += '</li>';
            content += '</ul>';
            content += '</a>';
            content += '</div>';
            content += '</div>';
            content += '</div>';
          }
        } else {
          // 絞り込みの結果、表示する供給者情報がない場合にメッセージを表示する
          content += '<div class="info-box bg-yellow">';
          content += '<div class="info-box-content">';
          content += '<span class="info-box-text">';
          content += '検索結果がありません。';
          content += '</span>';
          content += '</div>';
          content += '</div>';
        }
        $('.supplier_list_area').html(content);
        $(".sidebar-mini").removeClass('sidebar-open');
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        console.log(errorThrown);
      });
  });

  // 供給者情報の絞り込み実行
  $('.supplier_search_form').submit();
});