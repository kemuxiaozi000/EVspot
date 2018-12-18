$(document).ready(function () {
  var destination ="";
  var zoom = 13;
  var map;
  var marker = [];
  var markerinfo = [];
  var window_marker;
  var route_marker = "";

  // 目的地取得
  destination = $("#destination").val();
  $("#destination_text").val(destination);
  $("#route_destination").val(destination);
  if ($("#spot_lat").val() == "") {
    spotinfo();
  } else {
    route_search();
  }

  // 検索ボタン押下処理
  $("#destination_search").click(function() {
    $("#destination_search").prop("disabled", true);
    destination = $("#destination_text").val();
    $("#route_destination").val(destination);
    spotinfo();
  });

  // ルート再検索ボタン押下処理
  $("#research").click(function() {
    navigator.geolocation.getCurrentPosition(
      function(position){
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
          loc_map["location"] =  $("#route_via").val();
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
        DS.route(request, function(result, status) {
          route_search_init(DR, result);
        });
      },
      function(error){
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
        address : destination
      },
      type: "POST"
    })
    .done(function(data, textStatus, jqXHR) {
      if(data) {
        initMap(data);
      } else {
        alert("検索できませんでした。");
      }
      $("#destination_search").prop("disabled", false);
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
      alert("検索できませんでした。");
      console.log(errorThrown);
    })
    .always(function(jqXHR, textStatus, errorThrown) {
      console.log("complete:spotinfo");
    });
  }

  // マップ情報作成
  function initMap(data) {
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
      markerLatLng = new google.maps.LatLng({lat: data.spot[key].lat, lng: data.spot[key].lon}); // 緯度経度のデータ作成
      marker[key] = new google.maps.Marker({ // マーカーの追加
      position: markerLatLng, // マーカーを立てる位置を指定
        map: map // マーカーを立てる地図を指定
      });
      var content = "";
      content = '<div class="row">'

      content += '<div class="col-md-12">'
                 +   '<div class="box" style="border-top: 0px;">'
               +   '<div class="box-header"><span class="box-title">' + data.spot[key].name + '</span></div>'
             +   '<div id="spot_area" class="box-body" style="overflow: auto; height: 80px;">' ;
      for (i in data.spot[key].supplier) {
        content += '<div class="info-box" onclick="myFunction(this)">'
        switch (i) {
          case "0":
            content += '<span class="info-box-icon bg-green"><i class="fas fa-shopping-cart"></i></span>'
            break;
          case "1":
            content += '<span class="info-box-icon bg-yellow"><i class="fas fa-male"></i></span>'
            break;
          case "2":
            content += '<span class="info-box-icon bg-aqua"><i class="fas fa-cogs"></i></span>'
            break;
          default:
            content += '<span class="info-box-icon bg-aqua"><i class="fas fa-cogs"></i></span>'
            break;
        }

        content +=    '<div class="info-box-content">'
                +      '<span class="info-box-text">' + data.spot[key].supplier[i].name + '</span>'
                +      '<span class="info-box-number pull-right">' + data.spot[key].supplier[i].value + '<small>円</small></span>'
            +    '</div>'
            +   '<input type="hidden" id="coupon_id" value="'+ data.spot[key].coupon_id + '">'
            +   '<input type="hidden" id="spot_id" value="'+ data.spot[key].id + '">'
            +   '<input type="hidden" id="supplier_id" value="'+ data.spot[key].supplier[i].id + '">'
                +  '</div>'
      }
      content += '</div></div></div></div>'

      markerinfo[key] = new google.maps.InfoWindow({ // 吹き出しの追加
        content: content
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
        fillColor: "#FF0000",                //塗り潰し色
        fillOpacity: 0.8,                    //塗り潰し透過率
        path: google.maps.SymbolPath.CIRCLE, //円を指定
        scale: 16,                           //円のサイズ
        strokeColor: "#FF0000",              //枠の色
        strokeWeight: 1.0                    //枠の透過率
      },
      label: {
        text: 'G',                           //ラベル文字
        color: '#FFFFFF',                    //文字の色
        fontSize: '20px'                     //文字のサイズ
      }
    });

    // 円描画
    var circle = new google.maps.Circle({
      center: { // 地図の中心を指定
        lat: data.position.latitude, // 緯度
        lng: data.position.longitude // 経度
      },
      map: map ,
      radius: 5000 ,  // 半径（m）
      fillColor: '#FF0000',     // 塗りつぶし色
      fillOpacity:0.1,    // 塗りつぶし透過度（0: 透明 ⇔ 1:不透明）
      strokeColor: '#FF0000',    // 外周色
      strokeOpacity: 1,  // 外周透過度（0: 透明 ⇔ 1:不透明）
      strokeWeight: 1    // 外周太さ
    });
  }

  // マーカーにクリックイベントを追加
  function markerEvent(i) {
    marker[i].addListener('click', function() { // マーカーをクリックしたとき
      if (window_marker) {
        window_marker.close();
      }
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
      function(position){
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
        DS.route(request, function(result, status) {
          route_search_init(DR, result);
        });

        var geocoder = new google.maps.Geocoder();
        latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        geocoder.geocode({'latLng': latlng}, function(results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
            $("#route_departure").val(results[0].formatted_address);
          }
          else {
            alert("エラー" + status);
          }
        });

      },
      function(error){
        alert(error);
      }
    );

  }

  // ルート検索処理
  function route_search_init(DR, result) {
    var marker_point = Math.floor(result.routes[0].overview_path.length / 2);
    var route_lat = result.routes[0].overview_path[marker_point].lat();
    var route_lon = result.routes[0].overview_path[marker_point].lng();

    var route_marker_latlng = new google.maps.LatLng({lat: route_lat, lng: route_lon}); // 緯度経度のデータ作成
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

});