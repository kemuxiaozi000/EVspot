$(document).ready(function () {
  const DEF_LAT = 35.507456;
  const DEF_LON = 139.617585;
  const DEF_RANGE = 10;

  // 初期値設定
  var lat = 0;
  var lon = DEF_LON;
  var range = DEF_RANGE;
  // 表示サイズ
  var windowH = $(window).height();
  var headerH = $(".main-header").height();
  var contentPadding = parseInt($(".content").css("padding-top").replace('px', ''));
  contentPadding += parseInt($(".content").css("padding-bottom").replace('px', ''));
  contentPadding += parseInt($(".spot_list_area").css("padding-bottom").replace('px', ''));
  $(".spot_list_area").css("height", parseInt(windowH - headerH - contentPadding));

  // 現在地取得
  getMyplace(getPlace, getError);

  // 現在地取得後処理
  function getPlace(position) {
    console.log("getPlace", position);
    lat = position.coords.latitude; //緯度
    lon = position.coords.longitude; //経度

    // 周辺のクーポンを取得
    getArroundSpots(lat, lon, range);
  }

  // 絞り込みボタン押下処理
  $("#spot_search_form").submit(function (event) {
    // HTMLでの送信をキャンセル
    event.preventDefault();
    // 周辺のクーポンを取得
    getArroundSpots(lat, lon, range);
    $(".sidebar-mini").removeClass('sidebar-open');
  });

});

/**
 *  周辺のSpotを取得
 * @param {float} lat 緯度
 * @param {float} lon 経度
 * @param {integer} range 範囲(km)
 */
function getArroundSpots(lat, lon, range) {
  $.ajax({
    url: "/api/map/spotinfolatlon/read",
    data: {
      lat: lat,
      lon: lon,
      range: range,
      natural_energy: this.spot_search_form.natural_energy.checked
        ? "on"
        : "",
      toilet: this.spot_search_form.toilet.checked ? "on" : "",
      smoking_area: this.spot_search_form.smoking_area.checked ? "on" : "",
      rapid_charge: this.spot_search_form.rapid_charge.checked ? "on" : "",
      normal_charge: this.spot_search_form.normal_charge.checked
        ? "on"
        : "",
      cafe: this.spot_search_form.cafe.checked ? "on" : "",
      restaurant: this.spot_search_form.restaurant.checked ? "on" : "",
      shopping: this.spot_search_form.shopping.checked ? "on" : "",
      play_space: this.spot_search_form.play_space.checked ? "on" : "",
      nursing_room: this.spot_search_form.nursing_room.checked ? "on" : "",
      sightseeing: this.spot_search_form.sightseeing.checked ? "on" : "",
      coupon: this.spot_search_form.coupon.checked ? "on" : ""
    },
    type: "POST"
  })
    .done(function (data, textStatus, jqXHR) {
      // HTML作成
      var content = '';
      if (data) {
        data.spot.forEach(function (value) {
          content += '<div class="col-xs-12 spot-card">';
          content += '<a href="spot_detail?spot_id=' + value.id + '">';
          content += '<div class="h5 text-left spot-description" style="white-space: normal;">';
          content += value.name.split(' ').join('<br>');
          content += '</div>';
          content += '<div class="spot-image">';
          content += '<img src="' + noImage2 + '" height="138">'
          content += '</div>';
          content += '</a>';
          if (value.coupon_id == null) {
            content += '<div class="pull-right btn btn-primary" disabled style="margin-right: 8px;">';
            content += '<span class="h6">クーポン</span>';
            content += '</div>';
          } else {
            content += '<a class="pull-right btn btn-primary" href="coupon?spot_id=' + value.id + '" style="margin-right: 8px;">';
            content += '<span class="h6">クーポン</span>';
            content += '</a>';
          }
          content += '</div>';
        });
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
      $('.spot_list_area').html(content);
      $(".sidebar-mini").removeClass('sidebar-open');
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      alert("検索できませんでした。");
      console.log(errorThrown);
    })
    .always(function (jqXHR, textStatus, errorThrown) {
      console.log("complete:spotinfolatlon");
    });
}

function getError(error) {
  var err_msg = "";
  console.log("getGeolocationError", error);
  switch (error.code) {
    case 1:
      err_msg =
        "位置情報の利用が許可されていません。<br>設定より位置情報の利用を許可してください。";
      break;
    case 2:
      err_msg = "位置情報の取得に失敗しました。";
      break;
    case 3:
      err_msg = "タイムアウトしました。";
      break;
    default:
      err_msg = "エラーが発生しました。<br>管理者までご連絡ください。";
      alert(err_msg);
  }
}