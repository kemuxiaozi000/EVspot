$(document).ready(function () {
  // 現在地取得
  var latitude; //緯度
  var longitude; //経度

  // 現在地取得できない場合の初期値
  const DEF_LAT = 35.507456;
  const DEF_LON = 139.617585;
  var DEF_ZOOM;

  // 定数
  const START_MARKER = "https://maps.google.com/mapfiles/kml/pal4/icon62.png";
  const END_MARKER = "https://maps.google.com/mapfiles/kml/pal2/icon13.png";
  const CHNGE_ROOT_COLOR_YELLOW = 48000;
  const CHNGE_ROOT_COLOR_RED = 120000;

  // Marker情報
  var markers = [];
  // Markerコンテンツ情報
  var markerinfo = [];
  // 近傍のマーカーをまとめるMarkerClusterer
  var markerCluster;
  // 表示しているMarker
  var window_marker;
  // var route_marker = "";
  // ルート検索時の出発地(=現在地)のマーカー
  var departureMarker;
  // ルート検索時の目的地のマーカー
  var destinationMarker;

  // 充電時間
  var waitingTime = null;
  var docOpenTime = new Date();

  // DirectRendererオブジェクト(ルート検索表示)
  var DR;
  var directionsDisplay;

  // ルート検索時の線描画
  var stepPolyline;

  //charge画面からマップ画面に遷移する
  if (spotInfoZoom) {
    DEF_ZOOM = 15;
  } else {
    DEF_ZOOM = 13;
  }

  // 初期化
  var map = initMap();
  // 現在地取得
  getMyplace();

  // 絞り込みボタン押下処理
  $("#spot_search_form").submit(function (event) {
    // HTMLでの送信をキャンセル
    event.preventDefault();
    // 現在地における絞り込み検索を実行
    spotinfoLatLon($("#spot_lat").val(), $("#spot_lon").val());
    $(".sidebar-mini").removeClass('sidebar-open');
  });

  //ルート検索ボタン押下処理
  $("#destination_search").click(function () {
    if ($("#destination_text").val()) {
      console.log("destination_search button clicked");
      route_search($("#destination_text").val());
    }
  });

  // 目的地に設定ボタン押下処理
  $(document).on("click", ".destination_set", function () {
    key = $(this).val();
    if (window_marker) {
      window_marker.close();
    }
    var pos = markers[key].getPosition();
    route_search(pos);
  });

  // 地図の初期化
  function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
      center: {
        lat: DEF_LAT,
        lng: DEF_LON
      }, // 仮
      zoom: DEF_ZOOM,
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
    return map;
  }

  function getSpotsAroundMe(position) {
    console.log("getSpotsAroundMe", position);
    latitude = position.coords.latitude; //緯度
    longitude = position.coords.longitude; //経度
    spotinfoLatLon(latitude, longitude);
  }

  function getDirections(position, destination) {
    console.log("getDirections", position);
    if (DR) {
      DR.setMap(null);
      if (departureMarker) {
        departureMarker.setMap(null);
      }
      if (destinationMarker) {
        destinationMarker.setMap(null);
      }
    }

    // 48km以上のpolyLine削除
    if (directionsDisplay) {
      directionsDisplay.setMap(null);
      stepPolyline.setMap(null);
      polylines.forEach(function (line, index) {
        line.setMap(null);
      });
      polylines = [];
    }

    var DS = new google.maps.DirectionsService();
    DR = new google.maps.DirectionsRenderer({
      suppressMarkers: true
    });

    // 現在地
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;

    DR.setMap(map);
    var request = {
      origin: new google.maps.LatLng(lat, lon),
      destination: destination,
      travelMode: google.maps.TravelMode.DRIVING,
      optimizeWaypoints: true
    };
    DS.route(request, function (result, status) {
      var leg = result.routes[0].legs[0];

      if (leg.distance.value < CHNGE_ROOT_COLOR_YELLOW) {
        DR.setDirections(result);
        // 出発地(=現在地)のマーカー
        departureMarker = new google.maps.Marker({
          icon: START_MARKER,
          map: map,
          position: leg.start_location,
          zIndex: 1000
        });
        // 目的地のマーカー
        destinationMarker = new google.maps.Marker({
          icon: END_MARKER,
          map: map,
          position: leg.end_location,
          zIndex: 1001
        });
      } else {
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
        leg.steps.forEach(function (step) {
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
        var org = new google.maps.LatLng(lat, lon);
        calculateAndDisplayRoute(
          directionsService,
          directionsDisplay,
          waypts,
          org,
          destination
        );
      }

      var chargeTimes = getChargeTimes(result.routes[0].legs);
      // 必要充電回数の設定
      setChargeTimes(chargeTimes);
      var totalDurationSeconds = getTotalDuration(result.routes[0].legs);
      // 到着予想時刻の設定
      setEstimateTime(chargeTimes, totalDurationSeconds);

      $(".routeInfo").css("display", "block");
      $(".sidebar-mini").removeClass("sidebar-open");
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

  var getGeolocationOptions = {
    enableHighAccuracy: true
  };

  // 現在地取得
  function getMyplace() {
    if (!navigator.geolocation) {
      //Geolocation apiがサポートされていない場合
      alert("位置情報サービス非対応です。");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      function (position) {
        getSpotsAroundMe(position);
      },
      function (positionError) {
        getGeolocationError(positionError);
      },
      getGeolocationOptions
    ); //成功と失敗を判断
  }

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

  // ▽マップのイベント処理
  var dragEvent = new google.maps.event.addListener(map, "dragend", function () {
    var mappoint = map.getCenter();
    latitude = mappoint.lat();
    longitude = mappoint.lng();
    spotinfoLatLon(latitude, longitude);
  });

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
    var hasFacility = {
      isToilet: facilitiesinfo.toilet,
      isSmokingArea: facilitiesinfo.smoking_area,
      isRapidCharge: facilitiesinfo.rapid_charge,
      isNormalCharge: facilitiesinfo.normal_charge,
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

    content += '<div class="container-fluid">';
    content += '<div class="row">';
    content += '<div class="col-xs-12">';

    // タイトル
    content += '<div class="row">';
    content += '<span class="h5"><a href="/spot_detail?spot_id=' + spot_id + '"> '
      + spot_name +
      " </a></span>";
    content += "</div>";

    // アイコン表示
    content += '<div class="row" style="padding-bottom: 5px;padding-top: 5px;">';
    content += "<span>" + setIcon(hasFacility) + "</span>";
    content += "</div>";

    // テキストエリア start
    content += '<div class="row">';
    // 満空不可
    content += '<div class="col-xs-4" style="padding:0px;">';
    content += '<img src="' + image + '" alt="充電中..." height="50" width="55">';
    content += "</div>";

    // 右エリア
    content += '<div class="col-xs-8" style="padding-left:5px;">';
    // 充電待ち時間
    content += '<div class="col-xs-12 text-left" style="padding:0px;">';
    if (viewFlg == 1) {
      content += "<div>1人待ち</div>";
      content += "<div>" + timeString + "から充電可</div>";
    }
    if (pst_name == "クリーンエネルギー") {
      content += "<span> 自然エネルギー </span>";
    }
    // テキストエリア end
    content += '</div></div></div>'

    // ボタンエリア start
    content += '<div class="row">';
    // クーポンボタン
    if (coupon_id) {
      content +=
        '<div class="col-xs-4 text-center" style="padding:3px;"><a href="/coupon?spot_id=' +
        spot_id +
        '" class="btn btn-primary" style="font-size:9px;">クーポン</a></div>';
    }
    // 目的地ボタン
    content += '<div class="col-xs-4 text-center" style="padding:3px;">'
    content += '<button type="button" class="btn btn-success destination_set" value = "' + key + '" style="font-size:9px;">目的地</button>'
    content += '</div>'

    // 予約するボタン
    if (image != iconNotAvailable) {
      content += '<div class="col-xs-4 text-center" style="padding:3px;">'
      content += '<a class="btn btn-warning" id="appoint" href="" data-toggle="modal" data-target="#appointmentModal" role="button" style="font-size:9px;">　予約　</a>'
      content += '</div>'
    }
    // ボタンエリア　end
    content += '</div>'

    // container-fluid
    content += '</div></div></div>';

    return content;
  }

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
   * 必要充電回数を取得する
   * @param {Array<DirectionsLeg>} legs ルート検索結果の道順(曲がり角ごとの情報の配列)
   * @returns {number} 必要充電回数
   */
  function getChargeTimes(legs) {
    var journey = 0;
    for (var i in legs) {
      journey += legs[i].distance.value;
    }
    // 総距離(km換算)を96kmで割った結果を充電回数とする
    return parseInt(journey / 1000 / 96);
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
   * @returns {number} 充電無しの所要時間(単位:秒)
   */
  function getTotalDuration(legs) {
    var totalDuration = 0;
    for (var leg in legs) {
      totalDuration += legs[leg].duration.value;
    }
    return totalDuration;
  }

  /**
   * 到着予想時刻を画面に設定する
   * @param {number} chargeTimes 充電回数
   * @param {number} totalSeconds 充電無しの所要時間(単位:秒)
   */
  function setEstimateTime(chargeTimes, totalSeconds) {
    var totalDurationSeconds = totalSeconds;
    // 充電回数x30分を所要時間に加算(計算は秒単位で実施)
    if (chargeTimes > 0) {
      totalDurationSeconds += chargeTimes * 1800;
    }
    // 現在時刻を取得し、所要時間を加算
    var estimateDate = new Date();
    // 「hh:mm」にフォーマット
    estimateDate.setSeconds(totalDurationSeconds);
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

    // 画面上に到着予想時刻を出力
    $("#estimateTime").text(durationText);
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

  //アイコン表示
  function setIcon(hasFacility) {
    var icon_content = "";
    icon_content += '<div class="">';

    if (hasFacility["isToilet"] == 1) {
      icon_content +=
        '<img src="' +
        iconToilet +
        '" alt="..." height="20" width="20" style="margin-right: 3px;">';
    }

    if (hasFacility["isSmokingArea"] == 1) {
      icon_content +=
        '<img src="' +
        iconSmokingArea +
        '" alt="..." height="20" width="20" style="margin-right: 3px;">';
    }

    if (hasFacility["isRapidCharge"] == 1) {
      icon_content +=
        '<img src="' +
        iconRapidCharge +
        '" alt="..." height="20" width="20" style="margin-right: 3px;">';
    }

    if (hasFacility["isNormalCharge"] == 1) {
      icon_content +=
        '<img src="' +
        iconNormalCharge +
        '" alt="..." height="20" width="20" style="margin-right: 3px;">';
    }

    if (hasFacility["isCafe"] == 1) {
      icon_content +=
        '<img src="' +
        iconCafe +
        '" alt="..." height="20" width="20" style="margin-right: 3px;">';
    }

    if (hasFacility["isRestaurant"] == 1) {
      icon_content +=
        '<img src="' +
        iconRestaurant +
        '" alt="..." height="20" width="20" style="margin-right: 3px;">';
    }

    if (hasFacility["isShopping"] == 1) {
      icon_content +=
        '<img src="' +
        iconShopping +
        '" alt="..." height="20" width="20" style="margin-right: 3px;">';
    }

    if (hasFacility["isPlaySpace"] == 1) {
      icon_content +=
        '<img src="' +
        iconPlaySpace +
        '" alt="..." height="20" width="20" style="margin-right: 3px;">';
    }

    if (hasFacility["isNursingRoom"] == 1) {
      icon_content +=
        '<img src="' +
        iconNursingRoom +
        '" alt="..." height="20" width="20" style="margin-right: 3px;">';
    }

    if (hasFacility["isSightseeing"] != null) {
      icon_content +=
        '<img src="' +
        iconSightseeing +
        '" alt="..." height="20" width="20" style="margin-right: 3px;">';
    }
    icon_content += "</div>";
    return icon_content;
  }

  // 予約ダイアログの「〇」と「予」をクリックで交互に入れ替えるイベント登録
  $(".appointment_time").on("click", function () {
    var mark = $(this).text();
    if (mark == "〇") {
      $(".appointment_time").each(function (index, element) {
        if ($(element).text() != "✕") {
          $(element).text("〇");
        }
      });
      $(this).text("予");
    } else if (mark == "予") {
      $(this).text("〇");
    }
  });

  // 予約ダイアログの「OK」クリック時イベントの登録
  $("#confirm").on("click", function () {
    // 予約ダイアログを閉じる
    $("#appointmentModal").modal("hide");

    // 「予」があるかどうかをチェック
    var reserveFlag = false;
    $(".appointment_time").each(function (index, element) {
      if ($(element).text() == "予") {
        reserveFlag = true;
      }
    });

    if (reserveFlag) {
      // 通知ダイアログを表示する(500ミリ秒でフェードイン、5秒後に自動でフェードアウト)
      $("#alertFade").fadeIn(500);
      window.setTimeout(function () {
        $("#alertFade").fadeOut();
      }, 5000);
    }
  });

  // ルート検索処理 48kmを超えた場合
  function calculateAndDisplayRoute(
    directionsService,
    directionsDisplay,
    calcWaypts,
    origin,
    destination
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
          // 出発地(=現在地)のマーカー
          departureMarker = new google.maps.Marker({
            icon: START_MARKER,
            map: map,
            position: response.routes[0].legs[0].start_location,
            zIndex: 1000
          });
          // 目的地のマーカー
          destinationMarker = new google.maps.Marker({
            icon: END_MARKER,
            map: map,
            position:
              response.routes[0].legs[response.routes[0].legs.length - 1]
                .end_location,
            zIndex: 1001
          });
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
    for (var i = 0; i < polylines.length; i++) {
      polylines[i].setMap(null);
    }
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
});
