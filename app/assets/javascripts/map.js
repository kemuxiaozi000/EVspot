// Googleマップ本体
var map;
// 現在地取得
var latitude; //緯度
var longitude; //経度
var zoomLevel; // ズームレベル

// 現在地のマーカー
const START_MARKER = "https://maps.google.com/mapfiles/kml/pal4/icon62.png";
const END_MARKER = "https://maps.google.com/mapfiles/kml/pal2/icon13.png";
const STOPOVER_MARKER = "https://maps.google.com/mapfiles/kml/pal5/icon13.png";

// 現在地取得できない場合の初期値
const DEF_LAT = 35.507456;
const DEF_LON = 139.617585;
const DEF_ZOOM = 15;

// 充電待ち時間
var waitingTime = null;

// Marker情報
var markers = [];
// 表示しているMarker
var window_marker;
// ルート検索の目的地(String | google.maps.LatLng)
var destinationSpot = "";
// 経由地の緯度経度一覧(要素の型はgoogle.maps.LatLng)
var stopovers = new Array();

var getGeolocationOptions = {
  enableHighAccuracy: true
};

// 画面戻る用のパラメタ
var saveDestination = localStorage.getItem("destination") != null ? localStorage.getItem("destination") : null;
var saveDestinationLat = localStorage.getItem("destinationLat") != null ? localStorage.getItem("destinationLat") : null;
var saveDestinationLon = localStorage.getItem("destinationLon") != null ? localStorage.getItem("destinationLon") : null;
var saveCenterLat = localStorage.getItem("centerLat") != null ? Number(localStorage.getItem("centerLat")) : null;
var saveCenterLon = localStorage.getItem("centerLon") != null ? Number(localStorage.getItem("centerLon")) : null;
var saveViaLatList = localStorage.getItem("viaLat") != null ? JSON.parse(localStorage.getItem("viaLat")) : [];
var saveViaLonList = localStorage.getItem("viaLon") != null ? JSON.parse(localStorage.getItem("viaLon")) : [];
localStorage.clear();

// 地図の初期化
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: {
      lat: saveCenterLat == null ? DEF_LAT : saveCenterLat,
      lng: saveCenterLon == null ? DEF_LON : saveCenterLon
    }, // 仮
    zoom: zoomLevel,
    gestureHandling: "greedy",
    disableDoubleClickZoom: true,
    scrollwheel: true,
    clickableIcons: false,
    mapTypeControl: false, //マップタイプ コントロール
    fullscreenControl: false, //全画面表示コントロール
    streetViewControl: false, //ストリートビュー コントロール
    zoomControl: false //ズーム コントロール
  });
  var mapType = new google.maps.StyledMapType(mapstyle);
  map.mapTypes.set("style", mapType);
  map.setMapTypeId("style");
  saveCenterLat = map.getCenter().lat();
  saveCenterLon = map.getCenter().lng();
  return map;
}

function getSpotsAroundMe(position) {
  console.log("getSpotsAroundMe", position);
  latitude = position.coords.latitude; //緯度
  longitude = position.coords.longitude; //経度
  spotinfoLatLon(latitude, longitude);
  var myPlaceIcon = new google.maps.Marker({
    icon: START_MARKER,
    map: map,
    position: new google.maps.LatLng({
      lat: latitude,
      lng: longitude
    }),
    zIndex: google.maps.Marker.MAX_ZINDEX + 1
  });

  // 周辺スポット一覧
  if (document.getElementById("spot_list_area") != null) {
    var range = 10;
    // 周辺スポット情報を表示する
    getArroundSpots(latitude, longitude, range)
  }
}

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
      natural_energy: "",
      toilet: "",
      smoking_area: "",
      rapid_charge: "",
      normal_charge: "",
      cafe: "",
      restaurant: "",
      shopping: "",
      play_space: "",
      nursing_room: "",
      sightseeing: "",
      coupon: ""
    },
    type: "POST"
  })
    .done(function (data, textStatus, jqXHR) {
      // HTML作成
      var content = '';
      if (data) {
        data.spot.forEach(function (value) {
          content += '<a href="/spot_detail?spot_id=' + value.id + '">';
          content += '<div class="spot_info">';
          content += '<div class="col-xs-6">';
          content += '<span>' + value.name + '</span>';
          content += '</div >';
          content += '<div class="col-xs-3">';
          content += '<span>' + '10:00' + 'から充電可</span>';
          content += '</div>';
          content += '<div class="col-xs-3">';
          content += '<span>' + value.distance.toFixed(1) + 'km</span>';
          content += '</div>';
          content += '<div class="clearfix"></div>';
          content += '</div>';
          content += '</a>';
        });
      } else {
        // 絞り込みの結果、表示する供給者情報がない場合にメッセージを表示する
        content += '<div class="spot_info">';
        content += '<div class="col-xs-12">';
        content += '検索結果がありません。';
        content += '</div>';
        content += '</div>';
      }
      document.getElementById("spot_list_area").innerHTML = content;
      // $('.spot_list_area').html(content);
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      alert("検索できませんでした。");
      console.log(errorThrown);
    })
    .always(function (jqXHR, textStatus, errorThrown) {
      console.log("complete:spotinfolatlon");
    });
}

/**
 *　終了予定時間取得
 * @param {integer} minute 待ち時間
 * @return {string} 終了時刻
 */
function getEndtime(minute) {
  var min = minute % 60;
  var hr = parseInt(minute / 60);

  //今の時間取得
  var myDate = new Date();
  var nowtime_hr = myDate.getHours();
  var nowtime_min = myDate.getMinutes();
  var endtime_min = 0;
  var endtime_hr = 0;
  var timeString = "";
  if (nowtime_min + min >= 60) {
    endtime_min = nowtime_min + min - 60;
    if (nowtime_hr + hr + 1 >= 24) {
      endtime_hr = nowtime_hr + hr + 1 - 24;
    } else {
      endtime_hr = nowtime_hr + hr + 1;
    }
    endtime_hr = endtime_hr + hr;
  } else {
    endtime_min = nowtime_min + min;
    if (nowtime_hr + hr >= 24) {
      endtime_hr = nowtime_hr + hr - 24;
    } else {
      endtime_hr = nowtime_hr + hr;
    }
  }
  if (endtime_hr < 10) {
    timeString += "0";
  }
  timeString += endtime_hr;
  timeString += ":";
  if (endtime_min < 10) {
    timeString += "0";
  }
  timeString += endtime_min;
  return timeString;
}

// 充電種別アイコン表示
function setChargeTypeIcon(chargeTypes) {
  var icon_content = "";

  // 急速充電
  icon_content += '<img src="';
  icon_content += (chargeTypes["isRapidCharge"] == 1) ?
    iconRapidCharge : iconRapidChargeDisabled;
  icon_content += '" style="margin-left: 3px; margin-right: 3px;">';

  // 普通充電
  icon_content += '<img src="';
  icon_content += (chargeTypes["isNormalCharge"] == 1) ?
    iconNormalCharge : iconNormalChargeDisabled;
  icon_content += '">';

  return icon_content;
}

//アイコン表示
function setFacilityIcon(facilities) {
  var icon_content = "";
  // トイレ
  icon_content += '<img src="';
  icon_content += (facilities["isToilet"] == 1) ?
    iconToilet : iconToiletDisabled;
  icon_content += '">';
  // 喫煙所
  icon_content += '<img src="';
  icon_content += (facilities["isSmokingArea"] == 1) ?
    iconSmokingArea : iconSmokingAreaDisabled;
  icon_content += '">';
  // カフェ
  icon_content += '<img src="';
  icon_content += (facilities["isCafe"] == 1) ?
    iconCafe : iconCafeDisabled;
  icon_content += '">';
  // レストラン
  icon_content += '<img src="';
  icon_content += (facilities["isRestaurant"] == 1) ?
    iconRestaurant : iconRestaurantDisabled;
  icon_content += '">';
  // ショッピング
  icon_content += '<img src="';
  icon_content += (facilities["isShopping"] == 1) ?
    iconShopping : iconShoppingDisabled;
  icon_content += '">';
  // プレイスペース
  icon_content += '<img src="';
  icon_content += (facilities["isPlaySpace"] == 1) ?
    iconPlaySpace : iconPlaySpaceDisabled;
  icon_content += '">';
  // 授乳スペース
  icon_content += '<img src="';
  icon_content += (facilities["isNursingRoom"] == 1) ?
    iconNursingRoom : iconNursingRoomDisabled;
  icon_content += '">';
  // 観光スポット
  icon_content += '<img src="';
  icon_content += (facilities["isSightseeing"] == 1) ?
    iconSightseeing : iconSightseeingDisabled;
  icon_content += '">';
  return icon_content;
}

function backToCurrentPlace() {
  if (!navigator.geolocation) {
    //Geolocation apiがサポートされていない場合
    alert("位置情報サービス非対応です。");
    return;
  }
  navigator.geolocation.getCurrentPosition(
    function (position) {
      lat = position.coords.latitude;
      lon = position.coords.longitude;
      map.setCenter(new google.maps.LatLng(lat, lon), 13);
    },
    function (positionError) {
      getGeolocationError(positionError);
    },
    getGeolocationOptions
  ); //成功と失敗を判断
  return map;
}

$(document).ready(function () {

  // 画面リロード時にセッション内容を削除
  if (window.performance) {
    if (performance.navigation.type === 1) {
      // リロードされた
      saveDestination = null;
      saveDestinationLat = null;
      saveDestinationLon = null;
      saveCenterLat = null;
      saveCenterLon = null;
      saveViaLatList = [];
      saveViaLonList = [];
    }
  }

  //charge画面からマップ画面に遷移する
  if (spotInfoZoom) {
    zoomLevel = DEF_ZOOM;
  } else {
    zoomLevel = 13;
  }

  if ($("#spot_list_area").length) {
    // 「現在地へ戻る」ボタンの位置を調整
    var currentPlaceBottom = parseInt($(".currentPlace").parent().css("bottom").replace("px", ""));
    var spotListHeight = $("#spot_list_area").height();
    $(".currentPlace").parent().css("bottom", (currentPlaceBottom + spotListHeight) + "px");
    // ルート検索時の情報表示領域の位置を調整
    var routeInfoBottom = parseInt($(".routeInfo").css("bottom").replace("px", ""));
    $(".routeInfo").css("bottom", (routeInfoBottom + spotListHeight) + "px");
  }

  // 初期化
  map = initMap();
  // 現在地取得
  getMyplace(getSpotsAroundMe, getGeolocationError);

  // sessionを参照して画面を表示
  restartMap();

  // 絞り込みボタン押下処理
  $("#spot_search_form").submit(function (event) {
    // HTMLでの送信をキャンセル
    event.preventDefault();
    // 現在地における絞り込み検索を実行
    spotinfoLatLon($("#spot_lat").val(), $("#spot_lon").val());
    $(".sidebar-mini").removeClass("sidebar-open");
  });

  //ルート検索ボタン押下処理
  $("#destination_search").click(function () {
    if ($("#destination_text").val()) {
      console.log("destination_search button clicked");
      destinationSpot = $("#destination_text").val();
      saveDestination = destinationSpot;
      saveDestinationLat = null;
      saveDestinationLon = null;
      // 経由地をリセットする
      stopovers.splice(0, stopovers.length);
      saveViaLatList.splice(0, saveViaLatList.length);
      saveViaLonList.splice(0, saveViaLonList.length);
      route_search(destinationSpot);
    }
  });

  // 目的地に設定ボタン押下処理
  $(document).on("click", ".destination_set", function () {
    key = $(this).val();
    if (window_marker) {
      window_marker.close();
    }
    // 経由地をリセットする
    stopovers.splice(0, stopovers.length);
    saveViaLatList.splice(0, saveViaLatList.length);
    saveViaLonList.splice(0, saveViaLonList.length);
    destinationSpot = markers[key].getPosition();
    saveDestinationLat = destinationSpot.lat();
    saveDestinationLon = destinationSpot.lng();
    saveDestination = null;
    route_search(destinationSpot);
  });

  // 経由地に設定ボタン押下処理
  $(document).on("click", ".stopover", function () {
    key = $(this).val();
    if (window_marker) {
      window_marker.close();
    }
    var stopover = markers[key].getPosition();
    saveViaLatList.push(stopover.lat());
    saveViaLonList.push(stopover.lng());
    // 経由地を追加する
    stopovers.push(stopover);
    route_search(destinationSpot);
  });

  // ▽マップのイベント処理
  var dragEvent = new google.maps.event.addListener(map, "dragend", function () {
    pointSearch();
  });

  $(window).bind('beforeunload', function () {
    saveDestination != null ? localStorage.setItem("destination", saveDestination) : null;
    saveDestinationLat != null ? localStorage.setItem("destinationLat", saveDestinationLat) : null;
    saveDestinationLon != null ? localStorage.setItem("destinationLon", saveDestinationLon) : null;
    saveViaLatList.length > 0 ? localStorage.setItem("viaLat", JSON.stringify(saveViaLatList)) : null;
    saveViaLonList.length > 0 ? localStorage.setItem("viaLon", JSON.stringify(saveViaLonList)) : null;
    localStorage.setItem("centerLat", map.getCenter().lat());
    localStorage.setItem("centerLon", map.getCenter().lng());
  });

  //現在地戻る処理
  $(document).on("click", ".currentPlace", function () {
    backToCurrentPlace();
  });

  // mapの中心地のスポット情報を取得
  function pointSearch() {
    var mappoint = map.getCenter();
    latitude = mappoint.lat();
    longitude = mappoint.lng();
    saveCenterLat = latitude;
    saveCenterLon = longitude;
    spotinfoLatLon(latitude, longitude);
  }

  // 前のルート表示
  function restartMap() {
    pointSearch();
    if ((saveDestination != null || saveDestinationLat != null)) {
      destinationSpot = saveDestination != null ? saveDestination : new google.maps.LatLng(saveDestinationLat, saveDestinationLon);
      if (saveViaLatList.length > 0) {
        for (var viaIndex in saveViaLatList) {
          stopovers.push(new google.maps.LatLng(saveViaLatList[viaIndex], saveViaLonList[viaIndex]));
        }
      }
      route_search(destinationSpot);
    }
  }
});

