// 定数
const CHNGE_ROOT_COLOR_YELLOW = 48000;
const CHNGE_ROOT_COLOR_RED = 120000;

// ルート検索時の目的地のマーカー
var destinationMarker;
// ルート検索時の経由地のマーカー
var stopoverMarkers = [];

// DirectRendererオブジェクト(ルート検索表示)
var DR;
var directionsDisplay;
// ルート検索時の線描画
var stepPolyline;
// 現在位置
var nowPosition = "";
// 総充電回数
var totalChargeTimes = 0;
// 総合計距離
var totalDistance = 0;
// 総合計時間
var totalDurationSeconds = 0;

// ルート検索マップ情報作成
function route_search(destination) {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        getDirections(position, destination);
      },
      function (positionError) {
        getGeolocationError(positionError);
      },
      getGeolocationOptions
    );
  } else {
    console.log("error -- fail to get current position");
  }
}

async function getDirections(position, destination) {
  console.log("getDirections", position);
  if (DR) {
    DR.setMap(null);
    // 目的地マーカーの削除
    if (destinationMarker) {
      destinationMarker.setMap(null);
    }
    // 経由地マーカーの削除
    if (stopoverMarkers.length > 0) {
      for (var key in stopoverMarkers) {
        stopoverMarkers[key].setMap(null);
      }
      stopoverMarkers.splice(0, stopoverMarkers.length);
    }
  }
  // 経由地までの到着予想時刻を非表示にする
  $(".stopover1").css("display", "none");
  $(".stopover2").css("display", "none");
  $(".stopover3").css("display", "none");

  // 48km以上のpolyLine削除
  if (directionsDisplay) {
    directionsDisplay.setMap(null);
    stepPolyline.setMap(null);
    polylines.forEach(function (line, index) {
      line.setMap(null);
    });
    polylines = [];
  }

  // 現在地
  var lat = position.coords.latitude;
  var lon = position.coords.longitude;
  var origin = "";
  var stopoverData = "";
  nowPosition = new google.maps.LatLng(lat, lon);

  if (stopovers.length > 0) {
    for (var stopoverIndex in stopovers) {
      // 1回目
      if (stopoverIndex == 0) {
        origin = nowPosition;
        stopoverData = stopovers[stopoverIndex];
        await routeSearchDrawAsync(origin, stopoverData, parseInt(stopoverIndex));
      } else {
        origin = stopovers[stopoverIndex - 1];
        stopoverData = stopovers[stopoverIndex];
        await routeSearchDrawAsync(origin, stopoverData, parseInt(stopoverIndex));
      }
    }
    origin = stopovers[stopovers.length - 1];
    await routeSearchDrawAsync(origin, destination, -1);
    totalReset();
  } else {
    origin = nowPosition;
    await routeSearchDrawAsync(origin, destination, -1);
    totalReset();
  }
  $(".routeInfo").css("display", "block");
  $(".sidebar-mini").removeClass("sidebar-open");
}

// ルート検索の取得データリセット
function totalReset() {
  // 総充電回数のリセット
  totalChargeTimes = 0;
  // 総合計距離のリセット
  totalDistance = 0;
  // 総合計時間のリセット
  totalDurationSeconds = 0;
}

function routeSearchDrawAsync(origin, destination, stopoverIndex) {
  return new Promise((resolve) => {
    var lastFlg = (stopoverIndex < 0);
    var DS = new google.maps.DirectionsService();
    DR = new google.maps.DirectionsRenderer({
      suppressMarkers: true
    });

    DR.setMap(map);
    var request = {
      origin: origin,
      destination: destination,
      travelMode: google.maps.TravelMode.DRIVING,
      optimizeWaypoints: true
    };
    DS.route(request, function (result, status) {
      var leg = result.routes[0].legs[0];

      // 経路検索距離が48km以上のため色分けが必要
      var infowindow = new google.maps.InfoWindow();
      var directionsService = new google.maps.DirectionsService();
      directionsDisplay = new google.maps.DirectionsRenderer({
        suppressPolylines: true,
        suppressMarkers: true,
        infoWindow: infowindow
      });
      directionsDisplay.setMap(map);
      // 1.経由地点算出
      var distance = 0;
      var waypts = [];
      var flg48 = false;
      var flg120 = false;
      leg.steps.forEach(function (step, index) {
        distance = distance + step.distance.value;
        if (distance > CHNGE_ROOT_COLOR_YELLOW) {
          if (flg48 == false) {
            // 48kmを超えたためsteps.lat_lngsの配列数で一番近い地点を割り出す
            waypts.push(setWayPt(step, distance, CHNGE_ROOT_COLOR_YELLOW));
            console.log("over 48km -- set position");
            flg48 = true;
          }
        }
        if (distance > CHNGE_ROOT_COLOR_RED) {
          if (flg120 == false) {
            // 120kmを超えたためsteps.lat_lngsの配列数で一番近い地点を割り出す
            waypts.push(setWayPt(step, distance, CHNGE_ROOT_COLOR_RED));
            console.log("over 120km -- set position");
            flg120 = true;
          }
        }
      });
      // 2.calculateAndDisplayRoute
      var org = leg.start_location;
      calculateAndDisplayRoute(
        directionsService,
        directionsDisplay,
        waypts,
        org,
        destination,
        lastFlg
      );
      // 目的地までの距離を取得し、総距離に加算
      totalDistance += leg.distance.value;
      // 目的地までの所要時間を取得し、総所要時間に加算
      totalDurationSeconds += leg.duration.value;

      // 現在のルート描画範囲内での充電回数を、総充電回数に加算する
      totalChargeTimes += parseInt(leg.distance.value / 1000 / 96);

      if (lastFlg) {
        // 必要充電回数の設定
        setChargeTimes(totalChargeTimes);
        // 到着予想時刻の取得
        var totalEstimateTimeText = getEstimateTime(totalChargeTimes, totalDurationSeconds);
        // 到着予想時刻を画面に出力
        setEstimateTime("estimateTime", totalEstimateTimeText);

      } else {
        // 経由地到着予想時刻の設定
        var estimateTimeTextStopover = getEstimateTime(totalChargeTimes, totalDurationSeconds);
        // 経由地到着予想時刻を画面に出力
        setEstimateTime("estimateTimeStopover" + (stopoverIndex + 1), estimateTimeTextStopover);
        // 充電回数を1回分加算する
        totalChargeTimes++;
        $(".stopover" + (stopoverIndex + 1)).css("display", "block");
      }
      resolve("OK");
    });
  });
}

function getGeolocationError(error) {
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

function setWayPt(step, distance, threshold) {
  var bfDis = distance - step.distance.value;
  var lenNum = step.lat_lngs.length;
  var avgNum = step.distance.value / lenNum;
  for (var i = 0; i < lenNum; i++) {
    // 繰り返し処理
    bfDis = bfDis + avgNum;
    if (bfDis > threshold) {
      var waypt = {
        location: new google.maps.LatLng(
          step.lat_lngs[i].lat(),
          step.lat_lngs[i].lng()
        ),
        stopover: true
      };
      //waypts.push(waypt);
      return waypt;
    }
  }
}

/**
 * 目的地までの総距離を取得する
 * @param {Array<DirectionsLeg>} legs ルート検索結果の道順(曲がり角ごとの情報の配列)
 * @returns {number} 総距離
 */
function getTotalDistance(legs, start, end) {
  var totalDistance = 0;
  var startIndex = start ? start : 0;
  var endIndex = end ? end : legs.length;

  for (var index = startIndex; index < endIndex; index++) {
    totalDistance += legs[index].distance.value;
  }
  // 総距離
  return journey;
}

/**
 * 必要充電回数を画面に設定する
 * @param {number} chargeTimes 必要充電回数
 */
function setChargeTimes(chargeTimes) {
  // 画面上に必要充電回数を出力
  $("#numberOfTimes").text(chargeTimes);
}

/**
 * ルート検索時の、充電無しの所要時間を取得する
 * @param {Array<DirectionsLeg>} legs ルート検索結果の道順(曲がり角ごとの情報の配列)
 * @param {number} end 所要時間計算の終点となるインデックス(省略可能、省略時は最後まで加算)
 * @returns {number} 充電無しの所要時間(単位:秒)
 */
function getTotalDuration(legs, end) {
  var totalDuration = 0;
  var endIndex = end ? end : legs.length;

  for (var index = 0; index < endIndex; index++) {
    totalDuration += legs[index].duration.value;
  }
  return totalDuration;
}

/**
 * 到着予想時刻を取得する
 * @param {number} chargeTimes 充電回数
 * @param {number} durationSeconds 充電無しの所要時間(単位:秒)
 * @returns {String} 到着予想時刻(hh:mm形式)
 */
function getEstimateTime(chargeTimes, durationSeconds) {
  var totalSeconds = durationSeconds;
  // 充電回数x30分を所要時間に加算(計算は秒単位で実施)
  if (chargeTimes > 0) {
    totalSeconds += chargeTimes * 1800;
  }
  // 現在時刻を取得し、所要時間を加算
  var estimateDate = new Date();
  // 「hh:mm」にフォーマット
  estimateDate.setSeconds(totalSeconds);
  var durationText = "";
  if (estimateDate.getHours() < 10) {
    durationText += "0";
  }
  durationText += estimateDate.getHours();
  durationText += ":";
  if (estimateDate.getMinutes() < 10) {
    durationText += "0";
  }
  durationText += estimateDate.getMinutes();

  return durationText;
}

/**
 * 到着予想時刻を画面に設定する
 * @param {String} elementId 到着予想時刻を設定する要素のID
 * @param {String} estimateTimeText 到着予想時刻
 */
function setEstimateTime(elementId, estimateTimeText) {
  // 画面上に到着予想時刻を出力
  $("#" + elementId).text(estimateTimeText);
}

// ルート検索処理 48kmを超えた場合
function calculateAndDisplayRoute(
  directionsService,
  directionsDisplay,
  calcWaypts,
  origin,
  destination,
  lastFlg
) {
  // 充電残量ごとの位置情報を求めて設定する必要あり
  var waypts = calcWaypts;
  directionsService.route(
    {
      // 現在地
      origin: origin,
      // 目的地
      destination: destination,
      waypoints: waypts,
      optimizeWaypoints: true,
      travelMode: google.maps.TravelMode.DRIVING
    },
    function (response, status) {
      if (status === google.maps.DirectionsStatus.OK) {
        if (lastFlg) {
          // 目的地のマーカー
          destinationMarker = new google.maps.Marker({
            icon: END_MARKER,
            map: map,
            position:
              response.routes[0].legs[response.routes[0].legs.length - 1]
                .end_location,
            zIndex: google.maps.Marker.MAX_ZINDEX + 1
          });
          // 経由地のマーカー
          for (var i = 0; i < stopovers.length; i++) {
            stopoverMarkers[i] = new google.maps.Marker({
              icon: STOPOVER_MARKER,
              map: map,
              position: stopovers[i],
              zIndex: google.maps.Marker.MAX_ZINDEX + 1
            });
          }
        }
        directionsDisplay.setOptions({
          directions: response
        });
        var route = response.routes[0];
        renderDirectionsPolylines(response, map);
      } else {
        window.alert("Directions request failed due to " + status);
      }
    }
  );
}

var polylineOptions = {
  strokeColor: "#C83939",
  strokeOpacity: 1,
  strokeWeight: 4
};
var colors = ["#4169e1", "#ffa500", "#ff6347"];
var polylines = [];

// ルート検索線描画処理
function renderDirectionsPolylines(response) {
  var bounds = new google.maps.LatLngBounds();
  // for (var i = 0; i < polylines.length; i++) {
  //   polylines[i].setMap(null);
  // }
  var legs = response.routes[0].legs;
  for (i = 0; i < legs.length; i++) {
    var steps = legs[i].steps;
    for (j = 0; j < steps.length; j++) {
      var nextSegment = steps[j].path;
      stepPolyline = new google.maps.Polyline(polylineOptions);
      stepPolyline.setOptions({
        strokeColor: colors[i]
      });
      for (k = 0; k < nextSegment.length; k++) {
        stepPolyline.getPath().push(nextSegment[k]);
        bounds.extend(nextSegment[k]);
      }
      polylines.push(stepPolyline);
      stepPolyline.setMap(map);
    }
  }
  map.fitBounds(bounds);
}
