$(document).ready(function () {
  var destination = "";
  var zoom = 13;
  var map;
  var marker = [];
  var markerinfo = [];
  var window_marker;
  var route_marker = "";
  var waitingTime = null;
  var docOpenTime = new Date();
  var refreshTime = 0;

  // 目的地取得
  destination = $("#destination").val();
  $("#destination_text").val(destination);
  $("#route_destination").val(destination);

  // 条件判別を変更
  if ($("#destination").val() == "") {
    spotinfoLatLon($("#spot_lat").val(), $("#spot_lon").val());
  } else if ($("#spot_lat").val() == "") {
    spotinfo();
  } else {
    route_search();
  }

  // 絞り込みボタン押下処理
  $('#spot_search_form').submit(function (event) {
    // HTMLでの送信をキャンセル
    event.preventDefault();
    // 現在地における絞り込み検索を実行
    spotinfoLatLon($("#spot_lat").val(), $("#spot_lon").val());
  });

  // 検索ボタン押下処理
  $("#destination_search").click(function () {
    $("#destination_search").prop("disabled", true);
    destination = $("#destination_text").val();
    $("#route_destination").val(destination);
    spotinfo();
  });

  // ルート再検索ボタン押下処理
  $("#research").click(function () {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        var DS = new google.maps.DirectionsService();
        var DR = new google.maps.DirectionsRenderer();

        // 目的地
        var spot_lat = $("#spot_lat").val();
        var spot_lon = $("#spot_lon").val();
        // マップ作成
        map = new google.maps.Map(document.getElementById('map'), { // #mapに地図を埋め込む
          center: { // 地図の中心を指定
            lat: spot_lat, // 緯度
            lng: spot_lon // 経度
          },
          zoom: zoom, // 地図のズームを指定
          gestureHandling: 'greedy',
          mapTypeControl: false,
          fullscreenControl: false,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        });
        DR.setMap(map);

        var loc = [];
        var highway = false;
        var tolls = false;
        var ferries = false;

        if ($("#route_via").val() != "") {
          var loc_map = {};
          loc_map["location"] = $("#route_via").val();
          loc.push(loc_map);
        }
        if ($("#option1").prop("checked")) {
          highway = true;
        }
        if ($("#option2").prop("checked")) {
          tolls = true;
        }
        if ($("#option3").prop("checked")) {
          ferries = true;
        }

        var request = {
          origin: $("#route_departure").val(),
          destination: $("#route_destination").val(),
          travelMode: google.maps.TravelMode.DRIVING,
          waypoints: loc,
          avoidHighways: highway,
          avoidTolls: tolls,
          avoidFerries: ferries

        }
        DS.route(request, function (result, status) {
          route_search_init(DR, result);
        });
      },
      function (error) {
        alert(error);
      }
    )
    $(".sidebar-mini").removeClass('sidebar-open');
  });

  // スポット取得
  function spotinfo() {
    $.ajax({
      url: "/api/map/spotinfo/index",
      data: {
        address: destination
      },
      type: "POST"
    })
      .done(function (data, textStatus, jqXHR) {
        if (data) {
          initMap(data);
        } else {
          alert("検索できませんでした。");
        }
        $("#destination_search").prop("disabled", false);
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        alert("検索できませんでした。");
        console.log(errorThrown);
      })
      .always(function (jqXHR, textStatus, errorThrown) {
        console.log("complete:spotinfo");
      });
  }

  function spotinfoLatLon(lat, lon) {
    var toiletParam = this.spot_search_form.toilet.checked ? 'on' : '';
    var smokingAreaParam = this.spot_search_form.smoking_area.checked ? 'on' : '';
    var rapidChargeParam = this.spot_search_form.rapid_charge.checked ? 'on' : '';
    var normalChargeParam = this.spot_search_form.normal_charge.checked ? 'on' : '';
    var cafeParam = this.spot_search_form.cafe.checked ? 'on' : '';
    var restaurantParam = this.spot_search_form.restaurant.checked ? 'on' : '';
    var shoppingParam = this.spot_search_form.shopping.checked ? 'on' : '';
    var playSpaceParam = this.spot_search_form.play_space.checked ? 'on' : '';
    var nursingRoomParam = this.spot_search_form.nursing_room.checked ? 'on' : '';
    var sightseeingParam = this.spot_search_form.sightseeing.checked ? 'on' : '';
    var couponParam = this.spot_search_form.coupon.checked ? 'on' : '';

    $.ajax({
      url: "/api/map/spotinfolatlon/index",
      data: {
        lat: lat,
        lon: lon,
        toilet: toiletParam,
        smoking_area: smokingAreaParam,
        rapid_charge: rapidChargeParam,
        normal_charge: normalChargeParam,
        cafe: cafeParam,
        restaurant: restaurantParam,
        shopping: shoppingParam,
        play_space: playSpaceParam,
        nursing_room: nursingRoomParam,
        sightseeing: sightseeingParam,
        coupon: couponParam
      },
      type: "POST"
    })
      .done(function (data, textStatus, jqXHR) {
        if (data) {
          initMap(data);
        } else {
          alert("検索できませんでした。");
        }
        $("#destination_search").prop("disabled", false);
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        alert("検索できませんでした。");
        console.log(errorThrown);
      })
      .always(function (jqXHR, textStatus, errorThrown) {
        console.log("complete:spotinfo");
      });
  }

  // マップ情報作成
  function initMap(data) {
    if (waitingTime == null) {
      waitingTime = data.watingtime;
    }

    // マップ作成
    map = new google.maps.Map(document.getElementById('map'), { // #mapに地図を埋め込む
      center: { // 地図の中心を指定
        lat: data.position.latitude, // 緯度
        lng: data.position.longitude // 経度
      },
      zoom: zoom, // 地図のズームを指定
      gestureHandling: 'greedy',
      mapTypeControl: false,
      fullscreenControl: false,
    });

    // マーカー作成、吹き出し作成
    for (key in data.spot) {
      markerLatLng = new google.maps.LatLng({
        lat: data.spot[key].lat,
        lng: data.spot[key].lon
      }); // 緯度経度のデータ作成
      marker[key] = new google.maps.Marker({ // マーカーの追加
        position: markerLatLng, // マーカーを立てる位置を指定
        map: map // マーカーを立てる地図を指定
      });

      var content = "";
      var timeString = getEndtime(data.watingtime);

      markerinfo[key] = new google.maps.InfoWindow({ // 吹き出しの追加
        content: content,
        spot_id: data.spot[key].id,
        spot_name: data.spot[key].name,
        timeString: timeString,
        detail_data: data.spot[key].detail_data[0],
        pst_name: data.spot[key].supplier[0].pst_name,
        coupon_id: data.spot[key].coupon_id
      });
      markerEvent(key); // マーカーにクリックイベントを追加

    }
    // 目的地にマーカー作成
    marker[marker.length + 2] = new google.maps.Marker({ // マーカーの追加
      position: { // 地図の中心を指定
        lat: data.position.latitude, // 緯度
        lng: data.position.longitude // 経度
      },
      map: map,
      icon: {
        fillColor: "#FF0000", //塗り潰し色
        fillOpacity: 0.8, //塗り潰し透過率
        path: google.maps.SymbolPath.CIRCLE, //円を指定
        scale: 16, //円のサイズ
        strokeColor: "#FF0000", //枠の色
        strokeWeight: 1.0 //枠の透過率
      },
      label: {
        text: 'G', //ラベル文字
        color: '#FFFFFF', //文字の色
        fontSize: '20px' //文字のサイズ
      }
    });

    // 円描画
    var circle = new google.maps.Circle({
      center: { // 地図の中心を指定
        lat: data.position.latitude, // 緯度
        lng: data.position.longitude // 経度
      },
      map: map,
      radius: 5000, // 半径（m）
      fillColor: '#FF0000', // 塗りつぶし色
      fillOpacity: 0.1, // 塗りつぶし透過度（0: 透明 ⇔ 1:不透明）
      strokeColor: '#FF0000', // 外周色
      strokeOpacity: 1, // 外周透過度（0: 透明 ⇔ 1:不透明）
      strokeWeight: 1 // 外周太さ
    });

  }

  // マーカー内の内容を作成
  function markerContent(spot_id, spot_name, timeString, wating, facilitiesinfo, pst_name, coupon_id) {
    var image = "";
    var viewFlg = 0;
    var hasFacility = {
      'isToilet': facilitiesinfo.toilet,
      'isSmokingArea': facilitiesinfo.smoking_area,
      'isRapidCharge': facilitiesinfo.rapid_charge,
      'isNormalCharge': facilitiesinfo.normal_charge,
      'isCafe': facilitiesinfo.cafe,
      'isRestaurant': facilitiesinfo.restaurant,
      'isShopping': facilitiesinfo.shopping,
      'isPlaySpace': facilitiesinfo.play_space,
      'isNursingRoom': facilitiesinfo.nursing_room,
      'isSightseeing': facilitiesinfo.sightseeing
    };

    if ((parseInt(spot_id) % 9) == 0) {
      image = iconNotAvailable;
    } else {
      if (wating > 0 && (parseInt(spot_id) % 3) == 0) {
        image = iconFull;
        viewFlg = 1;
      } else {
        image = iconEmpty;
      }
    }

    content = '<input type="hidden" id="spot_id" value="<%= @spot_id %>"></input>';
    content += '<div class="container-fluid" style="margin:0px padding:0px;">';
    content += '<div class="row p-2">';

    content += '<div class="col-xs-12">';
    content += '<div>';
    content += '<div><span class="h4">' + spot_name + '</span></div>';
    content += '<div id="spot_area">';

    content += '<div class="row p-2" style="padding-bottom: 5px;padding-top: 5px;">';
    // アイコン 周辺情報など
    content += '<div class="col-xs-12">';

    content += '<span>' + setIcon(hasFacility) + '</span>';
    content += '</div>';
    content += '</div>';

    content += '<div class="row p-2">';

    // アイコン 満空不可
    content += '<div class="col-xs-4">';
    content += '<img src="' + image + '" alt="充電中..." height="60" width="60">';
    content += '</div>';


    content += '<div class="col-xs-8">';
    content += '<div class="row ">';

    // 営業時間
    // content += '<div class="col-xs-12 text-left">';
    // content += '<span>営業時間：-</span>';
    // content += '<span></span>';
    // content += '</div>';

    // 充電待ち時間
    content += '<div class="col-xs-12 text-left">';
    if (viewFlg == 1) {
      content += '<div>' + timeString + 'から充電可</div>'
      content += '<div  class="waiting-time">あと' + wating + '分で利用可</div>';
    } else {
      content += '<span class="waiting-time">-</span>';
    }
    content += '<span>' + pst_name + '</span>';
    if (coupon_id) {
      content += '<div><a href="/coupon?spot_id=' + spot_id + '">クーポン</a></div>';
    }
    content += '<div><a href="/spot_detail?spot_id=' + spot_id + '">詳細情報</a></div>';
    content += '</div>';

    content += '</div>';
    content += '</div>';


    // 電源種別
    // content += '<div class="col-xs-12 text-left">';
    // content += '<span>'+pst_name+'</span>';
    // content += '<span></span>';
    // content += '</div>';

    content += '</div></div></div></div></div></div></div>'

    return content

    // for (i in data.spot[key].supplier) {
    //   content += '<div class="info-box" onclick="myFunction(this)">'
    //   switch (i) {
    //     case "0":
    //       content += '<span class="info-box-icon bg-green"><i class="fas fa-shopping-cart"></i></span>'
    //       break;
    //     case "1":
    //       content += '<span class="info-box-icon bg-yellow"><i class="fas fa-male"></i></span>'
    //       break;
    //     case "2":
    //       content += '<span class="info-box-icon bg-aqua"><i class="fas fa-cogs"></i></span>'
    //       break;
    //     default:
    //       content += '<span class="info-box-icon bg-aqua"><i class="fas fa-cogs"></i></span>'
    //       break;
    //   }

    //   content +=    '<div class="info-box-content">'
    //           +      '<span class="info-box-text">' + data.spot[key].supplier[i].name + '</span>'
    //           +      '<span class="info-box-number pull-right">' + data.spot[key].supplier[i].value + '</span>'
    //           // +      '<span class="info-box-number pull-right">' + data.spot[key].supplier[i].value + '<small>円</small></span>'
    //       +    '</div>'
    //       +   '<input type="hidden" id="coupon_id" value="'+ data.spot[key].coupon_id + '">'
    //       +   '<input type="hidden" id="spot_id" value="'+ data.spot[key].id + '">'
    //       +   '<input type="hidden" id="supplier_id" value="'+ data.spot[key].supplier[i].id + '">'
    //       +  '</div>'
    // }
  }

  // マーカーにクリックイベントを追加
  function markerEvent(i) {
    marker[i].addListener('click', function () { // マーカーをクリックしたとき
      if (window_marker) {
        window_marker.close();
      }

      // 吹き出し内容の設定
      var markeropen = new Date();
      dispTime = parseInt((markeropen.getTime() - docOpenTime.getTime()) / (1000 * 60));
      dispTime = waitingTime - dispTime;
      dispTime = dispTime <= 0 ? 0 : dispTime;
      var cons = markerContent(markerinfo[i].spot_id, markerinfo[i].spot_name, markerinfo[i].timeString, dispTime,
        markerinfo[i].detail_data, markerinfo[i].pst_name, markerinfo[i].coupon_id)
      markerinfo[i].setContent(cons);
      markerinfo[i].open(map, marker[i]); // 吹き出しの表示
      window_marker = markerinfo[i];
    });
  }

  function infoBoxEvent() {
    // $(".info-box").addEventListener('click', function() {
    //   alert('アラート');
    // });
    alert('アラート');
  }

  // ルート検索マップ情報作成
  function route_search(data) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        var DS = new google.maps.DirectionsService();
        var DR = new google.maps.DirectionsRenderer();

        // 現在地
        var lat = position.coords.latitude;
        var lon = position.coords.longitude;

        // 目的地
        var spot_lat = $("#spot_lat").val();
        var spot_lon = $("#spot_lon").val();
        // マップ作成
        map = new google.maps.Map(document.getElementById('map'), { // #mapに地図を埋め込む
          center: { // 地図の中心を指定
            lat: lat, // 緯度
            lng: lon // 経度
          },
          zoom: zoom, // 地図のズームを指定
          gestureHandling: 'greedy',
          mapTypeControl: false,
          fullscreenControl: false,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        });
        DR.setMap(map);
        var request = {
          origin: new google.maps.LatLng(lat, lon),
          destination: new google.maps.LatLng(spot_lat, spot_lon),
          travelMode: google.maps.TravelMode.DRIVING,
          optimizeWaypoints: true
        }
        DS.route(request, function (result, status) {
          route_search_init(DR, result);
        });

        var geocoder = new google.maps.Geocoder();
        latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        geocoder.geocode({
          'latLng': latlng
        }, function (results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
            $("#route_departure").val(results[0].formatted_address);
          } else {
            alert("エラー" + status);
          }
        });

      },
      function (error) {
        alert(error);
      }
    );

  }

  // ルート検索処理
  function route_search_init(DR, result) {
    var marker_point = Math.floor(result.routes[0].overview_path.length / 2);
    var route_lat = result.routes[0].overview_path[marker_point].lat();
    var route_lon = result.routes[0].overview_path[marker_point].lng();

    var route_marker_latlng = new google.maps.LatLng({
      lat: route_lat,
      lng: route_lon
    }); // 緯度経度のデータ作成
    route_marker = new google.maps.Marker({ // マーカーの追加
      position: route_marker_latlng, // マーカーを立てる位置を指定
      map: map, // マーカーを立てる地図を指定
      visible: false
    });
    var route_content = "";
    var route_time = 0;
    var route_distance = 0;
    var route_hour = 0;
    var route_min = 0;
    for (key in result.routes[0].legs) {
      route_distance += parseInt(result.routes[0].legs[key].distance.value);
      route_time += parseInt(result.routes[0].legs[key].duration.value);
    }
    route_distance = Math.round(route_distance / 1000, 1);

    route_hour = Math.round(route_time / 3600);
    route_time = route_time - (route_hour * 3600);
    route_min = Math.round(route_time / 60);
    route_content = '<div>';
    route_content += '<p>';
    route_content += "距離 : " + route_distance + "km";
    route_content += '</p>';
    route_content += '<p>';
    route_content += "所要時間 : " + route_hour + "時" + route_min + "分";
    route_content += '</p>';
    route_content += '</div>';

    var infowindow = new google.maps.InfoWindow({
      content: route_content
    });
    infowindow.open(map, route_marker);
    DR.setDirections(result);
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
    var endtime_min = 0
    var endtime_hr = 0
    var timeString = ''
    if (nowtime_min + min >= 60) {
      endtime_min = nowtime_min + min - 60
      if (nowtime_hr + hr + 1 >= 24) {
        endtime_hr = nowtime_hr + hr + 1 - 24
      } else {
        endtime_hr = nowtime_hr + hr + 1
      }
      endtime_hr = endtime_hr + hr
    } else {
      endtime_min = nowtime_min + min
      if (nowtime_hr + hr >= 24) {
        endtime_hr = nowtime_hr + hr - 24
      } else {
        endtime_hr = nowtime_hr + hr
      }
    }
    if (endtime_hr < 10) {
      timeString += '0';
    }
    timeString += endtime_hr;
    timeString += ':';
    if (endtime_min < 10) {
      timeString += '0';
    }
    timeString += endtime_min;
    return timeString;
  }

  //アイコン表示
  function setIcon(hasFacility) {
    var icon_content = "";
    icon_content += '<div class="">';

    if (hasFacility['isToilet'] == 1) {
      icon_content += '<img src="' + iconToilet + '" alt="..." height="20" width="20" style="margin-right: 3px;">';
    }

    if (hasFacility['isSmokingArea'] == 1) {
      icon_content += '<img src="' + iconSmokingArea + '" alt="..." height="20" width="20" style="margin-right: 3px;">';
    }

    if (hasFacility['isRapidCharge'] == 1) {
      icon_content += '<img src="' + iconRapidCharge + '" alt="..." height="20" width="20" style="margin-right: 3px;">';
    }

    if (hasFacility['isNormalCharge'] == 1) {
      icon_content += '<img src="' + iconNormalCharge + '" alt="..." height="20" width="20" style="margin-right: 3px;">';
    }

    if (hasFacility['isCafe'] == 1) {
      icon_content += '<img src="' + iconCafe + '" alt="..." height="20" width="20" style="margin-right: 3px;">';
    }

    if (hasFacility['isRestaurant'] == 1) {
      icon_content += '<img src="' + iconRestaurant + '" alt="..." height="20" width="20" style="margin-right: 3px;">';
    }

    if (hasFacility['isShopping'] == 1) {
      icon_content += '<img src="' + iconShopping + '" alt="..." height="20" width="20" style="margin-right: 3px;">';
    }

    if (hasFacility['isPlaySpace'] == 1) {
      icon_content += '<img src="' + iconPlaySpace + '" alt="..." height="20" width="20" style="margin-right: 3px;">';
    }

    if (hasFacility['isNursingRoom'] == 1) {
      icon_content += '<img src="' + iconNursingRoom + '" alt="..." height="20" width="20" style="margin-right: 3px;">';
    }

    if (hasFacility['isSightseeing'] != null) {
      icon_content += '<img src="' + iconSightseeing + '" alt="..." height="20" width="20" style="margin-right: 3px;">';
    }
    icon_content += '</div>';
    return icon_content;
  }

});