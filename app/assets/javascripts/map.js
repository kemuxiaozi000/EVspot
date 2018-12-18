$(document).ready(function () {
  // 現在地取得
  var latitude; //緯度
  var longitude; //経度

  // 現在地取得できない場合の初期値
  const DEF_LAT = 35.507456;
  const DEF_LON = 139.617585;
  const DEF_ZOOM = 13;

  var zoom = 13;
  var map;
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
  var refreshTime = 0;

  // DirectRendererオブジェクト(ルート検索表示)
  var DR;

  // 初期化
  map = initMap();
  // 現在地取得
  getMyplace();

  // 絞り込みボタン押下処理
  $("#spot_search_form").submit(function (event) {
    // HTMLでの送信をキャンセル
    event.preventDefault();
    // 現在地における絞り込み検索を実行
    spotinfoLatLon($("#spot_lat").val(), $("#spot_lon").val());
  });

  //ルート検索ボタン押下処理
  $("#destination_search").click(function () {
    route_search($("#destination_text").val());
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
    return map;
  }

  // 現在地取得
  function getMyplace() {
    if (!navigator.geolocation) { //Geolocation apiがサポートされていない場合
      alert("位置情報サービス非対応です。");
      return;
    }

    function success(position) {
      latitude = position.coords.latitude; //緯度
      longitude = position.coords.longitude; //経度
      spotinfoLatLon(latitude, longitude);
    }

    function error(error) {
      var err_msg = "";
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

    navigator.geolocation.getCurrentPosition(success, error, {
      enableHighAccuracy: true
    }); //成功と失敗を判断
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
    markerCluster = new MarkerClusterer(map, markers,
      {
        imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m',
        maxZoom: 12
      }
    );
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
      var cons = markerContent(markerinfo[key].spot_id, markerinfo[key].spot_name, markerinfo[key].timeString, dispTime,
        markerinfo[key].detail_data, markerinfo[key].pst_name, markerinfo[key].coupon_id, key);
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
  function markerContent(spot_id, spot_name, timeString, wating, facilitiesinfo, pst_name, coupon_id, key) {
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

    content =
      '<input type="hidden" id="spot_id" value="' + spot_id + '"></input>';
    content += '<div class="container-fluid" style="margin:0px padding:0px;">';
    content += '<div class="row p-2">';

    content += '<div class="col-xs-12">';
    content += "<div>";
    content +=
      '<div ><span class="h4"><a href="/spot_detail?spot_id=' +
      spot_id +
      '"> ' +
      spot_name +
      " </a></span></div>";
    content += '<div id="spot_area">';

    content +=
      '<div class="row p-2" style="padding-bottom: 5px;padding-top: 5px;">';
    // アイコン 周辺情報など
    content += '<div class="col-xs-12">';

    content += "<span>" + setIcon(hasFacility) + "</span>";
    content += "</div>";
    content += "</div>";

    content += '<div class="row p-2">';

    // アイコン 満空不可
    content += '<div class="col-xs-4">';
    content +=
      '<img src="' + image + '" alt="充電中..." height="55" width="55">';
    content += "</div>";

    content += '<div class="col-xs-8">';
    content += '<div class="row ">';

    // 充電待ち時間
    content += '<div class="col-xs-12 text-left">';
    if (viewFlg == 1) {
      content += "<div>" + timeString + "から充電可</div>";
      content +=
        '<div  class="waiting-time">あと' + wating + "分で利用可</div>";
    }
    if (pst_name == "クリーンエネルギー") {
      content += "<span> 自然エネルギー </span>";
    }

    if (coupon_id) {
      content +=
        '<div style="margin-bottom: 2px;"><a href="/coupon?spot_id=' +
        spot_id +
        '" class="btn btn-primary btn-sm">クーポン</a></div>';
    }

    content += '<div><button type="button" class="btn btn-success btn-sm destination_set" value = "' + key + '">目的地に設定</button></div>'

    content += '</div></div></div></div></div></div></div>';
    content += '</div></div></div>';

    return content;
  }

  // ルート検索マップ情報作成
  function route_search(destination) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function (position) {
          if (DR) {
            DR.setMap(null);
            departureMarker.setMap(null);
            destinationMarker.setMap(null);
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
            // route_search_init(DR, result);
            DR.setDirections(result);
            var leg = result.routes[0].legs[0];
            // 出発地(=現在地)のマーカー
            departureMarker = new google.maps.Marker({
              icon: 'https://maps.google.com/mapfiles/kml/pal4/icon62.png',
              map: map,
              position: leg.start_location,
              zIndex: 1000
            });
            // 目的地のマーカー
            destinationMarker = new google.maps.Marker({
              icon: 'https://maps.google.com/mapfiles/kml/pal2/icon13.png',
              map: map,
              position: leg.end_location,
              zIndex: 1001
            });

            $(".sidebar-mini").removeClass('sidebar-open');
          });
        },
        function (error) {
          alert(error);
        }
      );
    } else {
      console.log("error -- fail to get current position");
    }
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
});
