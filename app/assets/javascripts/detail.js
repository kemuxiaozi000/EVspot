$(document).ready(function () {
  var coupon_id = "";
  var spot_id = $("#spot_id").val();
  var supplier_id = $("#supplier_id").val();
  // 詳細情報取得
  detailInfo();

  function detailInfo() {
    $.ajax({
      url: "/api/detail/spotdetailinfo/index",
      data: {
        spot_id : spot_id,
        supplier_id : supplier_id
      },
      type: "POST"
    })
    .done(function(data, textStatus, jqXHR) {
      if(data) {
        $("#spot_name").text(data.name);
        $("#spot_type").text(data.detail[0].remarks);
        $("#spot_tel").text(data.detail[0].tel);
        $("#spot_address").text(data.detail[0].address);
        $("#spot_time").text("平日:" + data.detail[0].week + ", 土:" + data.detail[0].sat +", 日:" + data.detail[0].sun);

        $("#spot_lat").val(data.lat);
        $("#spot_lon").val(data.lon);

        $("#coupon_name").text(data.coupon[0].title);
        $("#coupon_value").text(data.coupon[0].message);
        $("#coupon_start").text(data.coupon[0].from_date);
        $("#coupon_end").text(data.coupon[0].to_date);

        for (var key in data.supplier) {
          // html作成
          var content = '<div class="info-box">';
          content += '<span class="info-box-icon bg-aqua"><i class="fas fa-shopping-cart"></i></span>';
          content += '<div class="info-box-content">';
          content += '<span class="info-box-text">' + data.supplier[key].name + '</span>';
          content += '<span class="info-box-number">' + data.supplier[key].value + '<small>円</small></span>';
          if (data.coupon.length > 0) {
            content += '<span id="coupon_main" class="label label-success">クーポン</span>';
          }
          content += '</div></div>';
          $('#suplier_area').append(content);
        }
      }

    })
    .fail(function(jqXHR, textStatus, errorThrown) {
      console.log(errorThrown);
    })
    .always(function(jqXHR, textStatus, errorThrown) {
      console.log("complete:spotinfo");
    });
  }

  // ここへ向かう押下処理
  $("#route_search").click(function() {
    var url = "/map";
    var $postData;
    var $form = $('<form />', {
    action: url,
    method: 'get'
    });
    $postData = $('<input />', {type: 'hidden', name: 'destination', value: $("#spot_name").text()});
    $form.append($postData);
    $postData = $('<input />', {type: 'hidden', name: 'lat', value: $("#spot_lat").val()});
    $form.append($postData);
    $postData = $('<input />', {type: 'hidden', name: 'lon', value: $("#spot_lon").val()});
    $form.append($postData);
    $("body").append($form);
    $form.submit();
  });
});