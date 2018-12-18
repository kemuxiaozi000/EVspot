$(document).ready(function () {
  // 電源種別のIDを取得
  var powerSupplyTypeId = $('.power_supply_type_id').val();

  // 供給者の絞り込みボタンクリック時処理
  $('.supplier_search_form').submit(function (event) {
    // HTMLでの送信をキャンセル
    event.preventDefault();

    $.ajax({
      url: '/api/supplierlist/supplierinfo/index',
      type: 'post',
      data: {
        power_supply_type_id: powerSupplyTypeId,  // 電源種別
        name: $('#suppiler_search_name').val(),  // 名前
        price_min: $('#supplier_search_price_min').val(),  // 価格(min)
        price_max: $('#supplier_search_price_max').val(),  // 価格(max)
        production_area: $('#supplier_search_production_area').val(),  // 産地
        origin: $('#supplier_search_origin').val()  // 由来
      }
    })
    .done(function (data, textStatus, jqXHR) {
      // HTML作成
      var content = '';
      if (data) {
          // 供給者情報をレコードごとに表示する
          for (var key in data) {
          content += '<div class="info-box charging_select">';
          content += '<span class="info-box-icon bg-aqua">';
          content += '<i class="fa fa-battery-full"></i>';
          content += '</span>';
          content += '<div class="info-box-content">';
          content += '<span class="info-box-text">';
          content += '<strong>' + data[key].name + '</strong><br>';
          content += data[key].producing_area + '／' + data[key].origin;
          content += '</span>';
          content += '<span class="info-box-number">' + data[key].value + "円</span>"
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

  $(document).on('click', '.charging_select', function(){
    var url = "charging"
		var $form = $('<form />', {
      action: url,
      method: 'GET'
    });
    window.location.href = window.location.origin + "/" + url ;
  });

});
