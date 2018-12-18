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
            content += '<a href="supplier_detail?supplier_id=' + data[key].id + '">'
            content += '<ul class="products-list product-list-in-box charging_select" id="' + data[key].id + '" title="' + data[key].name + '">';
            content += '<li class="item">';

            content += '<div class="product-img">'
            // 発電画像設定処理
            if (data[key].name == 'NGE48') {
              content += '<img src="' + nge48 + '" >';
            } else if (data[key].origin == "太陽光") {
              content += '<img src="' + sun_electric + '" >';
            } else if (data[key].origin == "火力") {
              content += '<img src="' + fire_electric + '">';
            } else {
              content += '<img src="' + other_electric + '">';
            }
            content += '</div>';

            content += '<div class="product-info">';

            content += '<span class="label label-info pull-right">';
            content += '<strong style="font-size : large" >' + data[key].value + '円</strong>';
            content += '</span>';
            content += '<span class="product-title">';
            content += '<strong style="font-size : middle">' + data[key].comment + '</strong>';
            content += '</span>';

            content += '<span class="product-description" style="color: black;">'
            content += '<span style="font-size: 12px;">' + data[key].origin + '</span>';

            content += '</span>';

            content += '</div>';

            content += '</li>';
            content += '</ul>';
            content += '</a>';
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