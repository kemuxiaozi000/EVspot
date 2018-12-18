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
            content += '<ul class="products-list product-list-in-box charging_select" id="' + data[key].id + '" title="' + data[key].name + '">';
            content += '<li class="item">';

            content += '<div class="product-img">'
            // 写真設定処理
            if (data[key].photo == "hatakeyama.jpg") {
              content += '<img src="' + hatakeyama + '" >';
            } else if (data[key].photo == "matsubara.jpg") {
              content += '<img src="' + matsubara + '">';
            } else {
              content += '<img src="' + no_image + '">';
            }
            content += '</div>';

            content += '<div class="product-info">';

            content += '<span class="product-title">';
            content += '<strong>' + data[key].name + '</strong>';
            content += '<span class="label label-info pull-right"><strong>' + data[key].value + '円</strong></span>'
            content += '</span>';

            content += '<span class="product-description" style="color: black;">'
            content += '<span style="font-size: 12px;">' + data[key].producing_area + '／' + data[key].origin + '</span>';
            var comment = data[key].comment == null ? "コメントなし" : data[key].comment;
            content += '<span class="info-box-text" style="white-space: normal; font-size: 12px;">' + comment + "</span>"
            content += '</span>';

            content += '</div>';

            content += '</li>';
            content += '</ul>';

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

  $(document).on('click', '.charging_select', function () {
    $.ajax({
      url: '/api/supplierlist/supplierselect/index',
      type: 'post',
      data: {
        supplier_id: this.id,
        supplier_name: this.title
      }
    })
      .done(function (data, textStatus, jqXHR) {
        var url = "charging"
        var $form = $('<form />', {
          action: url,
          method: 'GET'
        });
        window.location.href = window.location.origin + "/" + url;
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        console.log(errorThrown);
      });
  });

});
