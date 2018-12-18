$(document).ready(function () {

  // Geolocation APIに対応している
  if (navigator.geolocation) {
    getPosition();
  // Geolocation APIに対応していない
  } else {
    alert("この端末では位置情報が取得できません");
  }

  // 検索ボタン押下処理
  $("#search").click(function() {
    var url = "/map";
    var $postData;
    var $form = $('<form />', {
    action: url,
    method: 'get'
    });
    $postData = $('<input />', {type: 'hidden', name: 'destination', value: $("#destination").val()});
    $form.append($postData);
    $("body").append($form);
    $form.submit();
  });

  // 現在値取得
  function getPosition() {
    navigator.geolocation.getCurrentPosition(
      function(position){
        couponinfo(position.coords.latitude, position.coords.longitude);

      },
      function(error){
        alert(error);
      }
    )
  }

  // クーポン取得
  function couponinfo(lat, lon) {

    // クーポン取得
    $.ajax({
      url: "/api/top/couponinfo/index",
      data: {
        current_place_lat: lat,
        current_place_lon: lon
      },
      type: "POST"
    })
    .done(function(data, textStatus, jqXHR) {
      if(data.length > 0) {
        for (var key in data) {
          // フレーム
          var frame = '<div class="info-box" onclick="myFunction('+ data[key].id +')">';
          frame += '<span class="info-box-icon bg-aqua"><i class="glyphicon glyphicon-gift"></i></span>'
              + '<div class="info-box-content">'
          // タイトル
              + '<span class="info-box-text">' + data[key].title + '</span>'
          // 内容
              + '<span class="info-box-number">' + data[key].message + '</span>'
              + '<input type="hidden" id="coupon_id" value="'+ data[key].id + '">'
              + '</div></div>'
          $('#coupon_area').append(frame);
        }
      }
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
      console.log(errorThrown);
    })
    .always(function(jqXHR, textStatus, errorThrown) {
      console.log("complete:couponinfo");
    });
  }

});