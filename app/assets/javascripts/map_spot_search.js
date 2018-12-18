// Markerコンテンツ情報
var markerinfo = [];
// 近傍のマーカーをまとめるMarkerClusterer
var markerCluster;
// ページ表示時の日時
var docOpenTime = new Date();

/**
 * 緯度、経度をもとにスポット情報
 * @param {number} lat 緯度
 * @param {number} lon 経度
 */
function spotinfoLatLon(lat, lon) {
  var zoomlevel = map.getZoom();
  if (zoomlevel > 10) {
    spotinfoLatLonSearch(latitude, longitude, zoomlevel);
  } else {
    // マーカーの初期化
    if (markers.length > 0) {
      deleteMarkers();
    }
  }
}

// スポット情報検索
var markerLoadingFlg = false;

function spotinfoLatLonSearch(lat, lon, zoomlevel) {
  // マーカーの初期化
  if (markers.length > 0) {
    deleteMarkers();
  }
  //コンテンツをセンタリングする
  centeringIndicatorSyncer();

  if (!markerLoadingFlg) {
    markerLoadingFlg = true;
    $.ajax({
      url: "/api/map/spotinfolatlon/index",
      data: {
        lat: lat,
        lon: lon,
        zoom: zoomlevel,
        natural_energy: this.spot_search_form.natural_energy.checked
          ? "on"
          : "",
        toilet: this.spot_search_form.toilet.checked ? "on" : "",
        smoking_area: this.spot_search_form.smoking_area.checked ? "on" : "",
        rapid_charge: this.spot_search_form.rapid_charge.checked ? "on" : "",
        normal_charge: this.spot_search_form.normal_charge.checked ? "on" : "",
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
        if (data) {
          setMarker(data);
        } else {
          alert("検索できませんでした。");
        }
        // $("#destination_search").prop("disabled", false);
        markerLoadingFlg = false;
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        alert("検索できませんでした。");
        console.log(errorThrown);
      })
      .always(function (jqXHR, textStatus, errorThrown) {
        console.log("complete:spotinfolatlon");
      });
  }
}

// マーカー作成
function setMarker(data) {
  if (waitingTime == null) {
    waitingTime = data.watingtime;
  }

  // マーカー作成、吹き出し作成
  for (key in data.spot) {
    markerLatLng = new google.maps.LatLng({
      lat: data.spot[key].lat,
      lng: data.spot[key].lon
    }); // 緯度経度のデータ作成
    var mark = new google.maps.Marker({
      // マーカーの追加
      position: markerLatLng // マーカーを立てる位置を指定
      // map: map // マーカーを立てる地図を指定
    });
    markers.push(mark);

    var content = "";
    var timeString = getEndtime(data.watingtime);

    markerinfo[key] = new google.maps.InfoWindow({
      // 吹き出しの追加
      content: content,
      spot_id: data.spot[key].id,
      spot_name: data.spot[key].name,
      timeString: timeString,
      detail_data: data.spot[key].detail_data,
      pst_name:
        data.spot[key].supplier[0] == null
          ? ""
          : data.spot[key].supplier[0].pst_name,
      coupon_id: data.spot[key].coupon_id
    });
    markerEvent(key); // マーカーにクリックイベントを追加
  }
  markerCluster = new MarkerClusterer(map, markers, {
    imagePath:
      "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m",
    maxZoom: 12
  });
}

// マーカーにクリックイベントを追加
function markerEvent(key) {
  markers[key].addListener("click", function () {
    // マーカーをクリックしたとき
    if (window_marker) {
      window_marker.close();
    }

    // 吹き出し内容の設定
    var markeropen = new Date();
    dispTime = parseInt(
      (markeropen.getTime() - docOpenTime.getTime()) / (1000 * 60)
    );
    dispTime = waitingTime - dispTime;
    dispTime = dispTime <= 0 ? 0 : dispTime;
    var cons = markerContent(
      markerinfo[key].spot_id,
      markerinfo[key].spot_name,
      markerinfo[key].timeString,
      dispTime,
      markerinfo[key].detail_data,
      markerinfo[key].pst_name,
      markerinfo[key].coupon_id,
      key
    );
    markerinfo[key].setContent(cons);
    markerinfo[key].open(map, markers[key]); // 吹き出しの表示
    window_marker = markerinfo[key];
  });
}

//マーカーを削除する
function deleteMarkers() {
  console.log("deleteMarkers");
  markers.forEach(function (marker, index) {
    marker.setMap(null);
  });
  if (markerCluster) {
    markerCluster.clearMarkers();
  }
  markers = [];
  markerinfo = [];
}

// マーカー内の内容を作成
function markerContent(
  spot_id,
  spot_name,
  timeString,
  wating,
  facilitiesinfo,
  pst_name,
  coupon_id,
  key
) {
  var image = "";
  var viewFlg = 0;
  var chargeTypes = {
    isRapidCharge: facilitiesinfo.rapid_charge,
    isNormalCharge: facilitiesinfo.normal_charge,
  };
  var facilities = {
    isToilet: facilitiesinfo.toilet,
    isSmokingArea: facilitiesinfo.smoking_area,
    isCafe: facilitiesinfo.cafe,
    isRestaurant: facilitiesinfo.restaurant,
    isShopping: facilitiesinfo.shopping,
    isPlaySpace: facilitiesinfo.play_space,
    isNursingRoom: facilitiesinfo.nursing_room,
    isSightseeing: facilitiesinfo.sightseeing
  };

  if (parseInt(spot_id) % 9 == 0) {
    image = iconNotAvailable;
  } else {
    if (wating > 0 && parseInt(spot_id) % 3 == 0) {
      image = iconFull;
      viewFlg = 1;
    } else {
      image = iconEmpty;
    }
  }

  // 尾張一宮PAを「空」にする
  if (parseInt(spot_id) == 895 || parseInt(spot_id) == 1129) {
    image = iconEmpty;
  }

  // 多賀SAを「空」にする
  if (parseInt(spot_id) == 2378 || parseInt(spot_id) == 2992) {
    image = iconEmpty;
  }

  // 養老SAを「満」にする
  if (parseInt(spot_id) == 9691 || parseInt(spot_id) == 9693) {
    if (wating > 0) {
      image = iconFull;
      viewFlg = 1;
    } else {
      image = iconEmpty;
      viewFlg = 0;
    }
  }

  content = '<input type="hidden" id="spot_id" value="' + spot_id + '"></input>';

  content += '<div class="container-fluid spot_baloon">';
  content += '<div class="row">';
  content += '<div class="col-xs-12">';

  // タイトル・充電種別
  content += '<div class="row">';
  content +=
    '<div class="col-xs-9">' +
    '<span class="h5"><a href="/spot_detail?spot_id=' + spot_id + '"> ' + spot_name + " </a></span></div>";
  content += '<div class="col-xs-3 spot_charge_types">' + setChargeTypeIcon(chargeTypes) + '</div>';
  content += "</div>";

  // スポット情報アイコン・クーポンボタン
  content += '<div class="row" style="padding-bottom: 5px;padding-top: 5px;">';
  content += '<div class="col-xs-8 spot_facilities">' + setFacilityIcon(facilities) + '</div>';
  content += '<div class="col-xs-4 text-center" style="padding: 3px;">';
  if (coupon_id) {
    content += '<a href="/coupon?spot_id=' + spot_id + '" class="btn btn-info btn-block" style="font-size:9px;">クーポン</a>';
  } else {
    content += '<button type="button" class="btn btn-info btn-block" style="font-size: 9px;" disabled>クーポン</button>';
  }
  content += '</div>';
  content += "</div>";

  // テキストエリア start
  content += '<div class="row">';
  // 満空不可
  content += '<div class="col-xs-4" style="padding:0px;">';
  content += '<img src="' + image + '" alt="充電中..." height="60" width="70">';
  content += "</div>";

  // 右エリア
  content += '<div class="col-xs-8 text-left">';
  // 充電待ち時間
  if (viewFlg == 1) {
    content += "<div>ただいま1人待ち</div>";
    content += "<div>" + timeString + "から充電可</div>";
  } else if (parseInt(spot_id) % 9 != 0) {
    content += "<div>ただいま待ちなし</div>";
    content += "<div>今すぐ充電可</div>"
  }
  if (pst_name == "クリーンエネルギー") {
    content += "<span> 自然エネルギー </span>";
  }
  content += "</div>";

  // テキストエリア end
  content += "</div>";

  // ボタンエリア start
  content += '<div class="row">';
  // 目的地ボタン
  content += '<div class="col-xs-4 text-center" style="padding:3px;">';
  content +=
    '<button type="button" class="btn btn-success btn-block destination_set" value = "' +
    key +
    '" style="font-size:9px;">目的地</button>';
  content += "</div>";

  var disableStyle =
    destinationSpot != "" && stopovers.length < 3 ? "" : "disabled";
  // 経由地ボタン
  content += '<div class="col-xs-4 text-center" style="padding:3px;">';
  content +=
    '<button type="button" class="btn btn-primary btn-block stopover" value = "' +
    key +
    '" style="font-size:9px;"' +
    disableStyle +
    ">経由地</button>";
  content += "</div>";
  // 予約するボタン
  content += '<div class="col-xs-4 text-center" style="padding: 3px;">';
  if (image != iconNotAvailable) {
    content +=
      '<a class="btn btn-warning btn-block" id="reservation" href="" data-toggle="modal" data-target="#reservationModal" data-spotid="' +
      spot_id + '" data-spotname="' + spot_name + '" role="button" style="font-size:9px;">予約</a>';
  } else {
    content += '<button type="button" class="btn btn-warning btn-block" style="font-size: 9px;" disabled>　予約　</button>';
  }
  content += '</div>';
  // ボタンエリア　end
  content += "</div>";

  // container-fluid
  content += "</div></div></div>";

  return content;
}
