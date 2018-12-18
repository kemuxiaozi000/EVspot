$(document).ready(function () {
  var coupon_id = "";
  var spot_id = $("#spot_id").val();
  var supplier_id = $("#supplier_id").val();
  var spot_lat = "";
  var spot_lon = "";

  // 詳細情報取得
  detailInfo();

  function detailInfo() {
    $.ajax({
      url: "/api/detail/spotdetailinfo/index",
      data: {
        spot_id: spot_id,
        supplier_id: supplier_id
      },
      type: "POST"
    })
      .done(function (data, textStatus, jqXHR) {
        if (data) {
          $("#spot_name").text(data.name);
          // $("#spot_type").text(data.detail[0].remarks);
          var spotTypeText = "電源種別: ";
          spotTypeText += data.detail[0].rapid_charge == 1 ? "急速充電" : "";
          if (
            data.detail[0].normal_charge == 1 &&
            data.detail[0].rapid_charge == 1
          ) {
            spotTypeText += spotTypeText != "" ? ", " : "";
          }
          spotTypeText += data.detail[0].normal_charge == 1 ? "普通充電" : "";
          $("#spot_type").text(spotTypeText);
          $("#spot_tel").text(data.detail[0].tel);
          $("#spot_address").text(data.detail[0].address);
          $("#spot_time").text(
            "営業時間: " + (data.detail[0].week ? data.detail[0].week : "-")
          );
          var busyTimeText = "混雑時間帯: ";
          busyTimeText += data.detail[0].crowded_time_zone
            ? data.detail[0].crowded_time_zone
            : "なし";
          $("#busy_time").text(busyTimeText);
          var supportedServicesText = "対象サービス: ";
          supportedServicesText += data.detail[0].ncs == 1 ? "NCS" : "";
          if (
            (data.detail[0].zesp2 == 1 || data.detail[0].other_services == 1) &&
            data.detail[0].ncs == 1
          ) {
            supportedServicesText += supportedServicesText != "" ? ", " : "";
          }
          supportedServicesText += data.detail[0].zesp2 == 1 ? "ZESP2" : "";
          if (data.detail[0].other_services == 1 && data.detail[0].zesp2 == 1) {
            supportedServicesText += supportedServicesText != "" ? ", " : "";
          }
          supportedServicesText +=
            data.detail[0].other_services == 1 ? "その他サービス" : "";
          $("#target_service").text(supportedServicesText);

          spot_lat = data.lat;
          spot_lon = data.lon;

          // $("#coupon_name").text(data.coupon[0].title);
          // $("#coupon_value").text(data.coupon[0].message);
          // $("#coupon_start").text(data.coupon[0].from_date);
          // $("#coupon_end").text(data.coupon[0].to_date);

          // for (var key in data.supplier) {
          //   // html作成
          //   var content = '<div class="info-box">';
          //   content += '<span class="info-box-icon bg-aqua"><i class="fas fa-shopping-cart"></i></span>';
          //   content += '<div class="info-box-content">';
          //   content += '<span class="info-box-text">' + data.supplier[key].name + '</span>';
          //   content += '<span class="info-box-number">' + data.supplier[key].value + '<small>円</small></span>';
          //   if (data.coupon.length > 0) {
          //     content += '<span id="coupon_main" class="label label-success">クーポン</span>';
          //   }
          //   content += '</div></div>';
          //   $('#suplier_area').append(content);
          // }
          // HTML作成
          var content = "";
          var hasFacility = {
            isToilet: data.detail[0].toilet,
            isSmokingArea: data.detail[0].smoking_area,
            isRapidCharge: data.detail[0].rapid_charge,
            isNormalCharge: data.detail[0].normal_charge,
            isCafe: data.detail[0].cafe,
            isRestaurant: data.detail[0].restaurant,
            isShopping: data.detail[0].shopping,
            isPlaySpace: data.detail[0].play_space,
            isNursingRoom: data.detail[0].nursing_room,
            isSightseeing: data.detail[0].sightseeing
          };

          content += "<span>" + setIcon(hasFacility) + "</span>";
          $(".detail_icon").html(content);
        }
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        console.log(errorThrown);
      })
      .always(function (jqXHR, textStatus, errorThrown) {
        console.log("complete:spotinfo");
      });
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

  // ここへ行くボタン押下処理
  $("#destination").on("click", function () {
    // localStorageの情報をクリア
    localStorage.clear();

    // 経度緯度をlocalStrageに保管
    localStorage.setItem("destinationLat", spot_lat);
    localStorage.setItem("destinationLon", spot_lon);

    // 地図画面へ移動
    var url = "/map";
    var $postData;
    var $form = $('<form />', {
      action: url,
      method: 'get'
    });
    $("body").append($form);
    $form.submit();
  });

  // 予約ボタンを一定の割合でdisabeledにする
  if (parseInt(spot_id) % 9 == 0) {
    document.getElementById("reservation").removeAttribute("data-toggle");
    document.getElementById("reservation").classList.add("disabled");
  }

});
