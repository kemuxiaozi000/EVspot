// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.

$(document).ready(function () {
  reloadTable(data);


  // 編集ボタン押下処理
  $(document).on("click", ".spotsEdit", function () {
    spotsId = $(this).val();

    clearMessage();
    $.ajax({
      url: '/api/management/admin_spot/index',
      type: 'post',
      data: {
        id: spotsId
      }
    })
      .done(function (result, textStatus, jqXHR) {
        if (result != undefined) {
          $('.spots_id').val(result[0].id);
          $('.spots_name').val(result[0].name);
          $('.spots_lat').val(result[0].lat);
          $('.spots_lon').val(result[0].lon);
          $('.spots_coupon_id').val(result[0].coupon_id);
          $('.spots_supplier_id').val(result[0].supplier_id);
          $('.spots_detail_id').val(result[0].detail_id);
          document.getElementById("edit_form").style.display = "block";
        }
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        warningMessage('スポット情報の取得に失敗しました。')
      });

    $.ajax({
      url: '/api/management/admin_spot/index2',
      type: 'post',
      data: {
        id: spotsId
      }
    })
      .done(function (result, textStatus, jqXHR) {
        if (result != undefined) {
          $('.spot_details_address').val(result[0].address);
          $('.spot_details_week').val(result[0].week);
          $('.spot_details_sat').val(result[0].sat);
          $('.spot_details_sun').val(result[0].sun);
          $('.spot_details_holiday').val(result[0].holiday);
          $('.spot_details_sales_remarkes').val(result[0].sales_remarkes);
          $('.spot_details_tel').val(result[0].tel);
          $('.spot_details_remarks').val(result[0].remarks);
          $('.spot_details_stand_1').val(result[0].stand_1);
          $('.spot_details_stand_2').val(result[0].stand_2);
          $('.spot_details_stand_3').val(result[0].stand_3);
          $('.spot_details_additional_information').val(result[0].additional_information);
          $('.spot_details_charge_types').val(result[0].charge_types);
          $('.spot_details_facility_information').val(result[0].facility_information);
          $('.spot_details_nearby_information').val(result[0].nearby_information);
          $('.spot_details_supported_services').val(result[0].supported_services);
          $('.spot_details_crowded_time_zone').val(result[0].crowded_time_zone);

          //トイレ、喫煙所
          if (result[0].additional_information.indexOf('トイレ') !== -1) {
            document.getElementsByName('additional_information')[0].checked = true;
          } else {
            document.getElementsByName('additional_information')[0].checked = false;
          }
          if (result[0].additional_information.indexOf('喫煙所') !== -1) {
            document.getElementsByName('additional_information')[1].checked = true;
          } else {
            document.getElementsByName('additional_information')[1].checked = false;
          }

          //普通充電、急速充電
          if (result[0].charge_types.indexOf('普通充電') !== -1) {
            document.getElementsByName('charge_types')[0].checked = true;
          } else {
            document.getElementsByName('charge_types')[0].checked = false;
          }
          if (result[0].charge_types.indexOf('急速充電') !== -1) {
            document.getElementsByName('charge_types')[1].checked = true;
          } else {
            document.getElementsByName('charge_types')[1].checked = false;
          }

          //カフェ、レストラン、遊び場、ショッピング、授乳室
          if (result[0].facility_information.indexOf('カフェ') !== -1) {
            document.getElementsByName('facility_information')[0].checked = true;
          } else {
            document.getElementsByName('facility_information')[0].checked = false;
          }
          if (result[0].facility_information.indexOf('レストラン') !== -1) {
            document.getElementsByName('facility_information')[1].checked = true;
          } else {
            document.getElementsByName('facility_information')[1].checked = false;
          }
          if (result[0].facility_information.indexOf('遊び場') !== -1) {
            document.getElementsByName('facility_information')[2].checked = true;
          } else {
            document.getElementsByName('facility_information')[2].checked = false;
          }
          if (result[0].facility_information.indexOf('ショッピング') !== -1) {
            document.getElementsByName('facility_information')[3].checked = true;
          } else {
            document.getElementsByName('facility_information')[3].checked = false;
          }
          if (result[0].facility_information.indexOf('授乳室') !== -1) {
            document.getElementsByName('facility_information')[4].checked = true;
          } else {
            document.getElementsByName('facility_information')[4].checked = false;
          }

        }
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        warningMessage('スポット情報の取得に失敗しました。')
      });
  });

  // 削除ボタン押下処理
  $(document).on("click", ".spotsDelete", function () {
    spotsId = $(this).val();
    if (!confirm(spotsId + 'のスポット情報を削除します。よろしいですか？')) {
      return false;
    }
    // 以降は確認ダイアログで「はい」がクリックされた場合の処理
    $.ajax({
      url: '/api/management/admin_spot/destroy',
      type: 'post',
      data: {
        id: spotsId
      }
    })
      .done(function (result, textStatus, jqXHR) {
        infoMessage('スポット情報の削除が完了しました。');

        // 最新の内容でスポット情報一覧を再描画
        //reloadTable(result);
        location.reload();
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        warningMessage('スポット情報の削除に失敗しました。')
      });
  });

});

/**
 * get datatables spotsId data
 * @param <integer> rowIndex
 */
function getTableSpotsIdData(rowIndex) {
  var table = $('#result-table').DataTable();
  var data = table.rows().data();
  return data[rowIndex][1];
}

function clearMessage() {
  // 通知メッセージおよび警告メッセージを非表示にする
  $('#info_message').empty();
  $('#info_message').attr('style', 'display: none;');
  $('#warning_message').empty();
  $('#warning_message').attr('style', 'display: none;');
}

function infoMessage(message) {
  clearMessage();
  // 通知メッセージ領域にメッセージを表示する
  $('#info_message').empty().append(message);
  $('#info_message').attr('style', 'display: block;');
}

function warningMessage(message) {
  clearMessage();
  // 警告メッセージ領域にメッセージを表示する
  $('#warning_message').empty().append(message);
  $('#warning_message').attr('style', 'display: block;');
}


// 引数の内容でスポット一覧を再描画する
function reloadTable(data) {

  if (data.length > 0) {
    var datalist = new Array();

    for (key in data) {
      spotsId = data[key].id;
      spotsName = data[key].name;
      spotsLat = data[key].lat;
      spotsLon = data[key].lon;
      spotsCouponId = data[key].coupon_id;
      spotsSupplierId = data[key].supplier_id;
      spotsDetailId = data[key].detail_id;
      if (data_detail[key].address != '') {
        spotsDetailAddress = data_detail[key].address;
        spotsDetailWeek = data_detail[key].week;
        spotsDetailSat = data_detail[key].sat;
        spotsDetailSun = data_detail[key].sun;
        spotsDetailHoliday = data_detail[key].holiday;
        spotsDetailSales_remarkes = data_detail[key].sales_remarkes;
        spotsDetailTel = data_detail[key].tel;
        spotsDetailRemarks = data_detail[key].remarks;
        spotsDetailStand_1 = data_detail[key].stand_1;
        spotsDetailStand_2 = data_detail[key].stand_2;
        spotsDetailStand_3 = data_detail[key].stand_3;
        spotsDetailAdditional_information = data_detail[key].additional_information;
        spotsDetailCharge_types = data_detail[key].charge_types;
        spotsDetailFacility_information = data_detail[key].facility_information;
        spotsDetailNearby_information = data_detail[key].nearby_information;
        spotsDetailSupported_services = data_detail[key].supported_services;
        spotsDetailCrowded_time_zone = data_detail[key].crowded_time_zone;
      } else {
        spotsDetailAddress = "";
        spotsDetailWeek = "";
        spotsDetailSat = "";
        spotsDetailSun = "";
        spotsDetailHoliday = "";
        spotsDetailSales_remarkes = "";
        spotsDetailTel = "";
        spotsDetailRemarks = "";
        spotsDetailStand_1 = "";
        spotsDetailStand_2 = "";
        spotsDetailStand_3 = "";
        spotsDetailAdditional_information = "";
        spotsDetailCharge_types = "";
        spotsDetailFacility_information = "";
        spotsDetailNearby_information = "";
        spotsDetailSupported_services = "";
        spotsDetailCrowded_time_zone = "";
      }

      var rowData = new Array();
      rowData[0] = spotsId;
      rowData[1] = spotsName;
      rowData[2] = spotsLat;
      rowData[3] = spotsLon;
      rowData[4] = spotsCouponId;
      rowData[5] = spotsSupplierId;
      rowData[6] = spotsDetailId;
      htmlString = '<center><button class="btn btn-success spotsMapCheck" data-toggle="modal" data-target="#MapCheck" data-backdrop="true" type="button" value="' + spotsId + ':' + spotsDetailId + '">地図確認</button></center>';
      rowData[7] = htmlString;
      rowData[8] = spotsDetailAddress;
      rowData[9] = spotsDetailWeek;
      rowData[10] = spotsDetailSat;
      rowData[11] = spotsDetailSun;
      rowData[12] = spotsDetailHoliday;
      rowData[13] = spotsDetailSales_remarkes;
      rowData[14] = spotsDetailTel;
      rowData[15] = spotsDetailRemarks;
      rowData[16] = spotsDetailStand_1;
      rowData[17] = spotsDetailStand_2;
      rowData[18] = spotsDetailStand_3;
      rowData[19] = spotsDetailAdditional_information;
      rowData[20] = spotsDetailCharge_types;
      rowData[21] = spotsDetailFacility_information;
      rowData[22] = spotsDetailNearby_information;
      rowData[23] = spotsDetailSupported_services;
      rowData[24] = spotsDetailCrowded_time_zone;
      htmlString = '<center><button class="btn btn-info spotsEdit" type="button" value="' + spotsId + '">編集</button></center>';
      rowData[25] = htmlString;
      htmlString = '<center><button class="btn btn-danger spotsDelete" type="button" value="' + spotsId + '">削除</button></center>';
      rowData[26] = htmlString;
      datalist[key] = rowData;
    }

    dt = $('#result-table').DataTable({
      scrollX: true,
      scrollY: 420,
      retrieve: true,
      ordering: true,
      lengthChange: false,
      searching: false,
      info: false,
      paging: false,
      order: [0, "asc"],
      data: datalist,
      "columnDefs": [
        {
          "searchable": false,
          "orderable": false,
          "targets": [25, 26]
        },
        {
          "targets": [2, 3],
          "visible": false,
          "searchable": false
        },
      ]
    });
    dt.columns.adjust();
  }

  // 編集領域に入力したスポットの登録・編集
  $('#admin_spot_form').submit(function (event) {
    // HTMLでの送信をキャンセル
    event.preventDefault();
    // 通知メッセージ領域・警告メッセージ領域を非表示にする
    clearMessage();

    var spotsId = $(this).find('.spots_id').val();
    var spotsName = $(this).find('.spots_name').val();
    var spotsLat = $(this).find('.spots_lat').val();
    var spotsLon = $(this).find('.spots_lon').val();
    var spotsCouponId = $(this).find('.spots_coupon_id').val();
    var spotsSupplierId = $(this).find('.spots_supplier_id').val();
    var spotsDetailId = $(this).find('.spots_detail_id').val();
    var spotsDetailAddress = $(this).find('.spot_details_address').val();
    var spotsDetailWeek = $(this).find('.spot_details_week').val();
    var spotsDetailSat = $(this).find('.spot_details_sat').val();
    var spotsDetailSun = $(this).find('.spot_details_sun').val();
    var spotsDetailHoliday = $(this).find('.spot_details_holiday').val();
    var spotsDetailSales_remarkes = $(this).find('.spot_details_sales_remarkes').val();
    var spotsDetailTel = $(this).find('.spot_details_tel').val();
    var spotsDetailRemarks = $(this).find('.spot_details_remarks').val();
    var spotsDetailStand_1 = $(this).find('.spot_details_stand_1').val();
    var spotsDetailStand_2 = $(this).find('.spot_details_stand_2').val();
    var spotsDetailStand_3 = $(this).find('.spot_details_stand_3').val();

    var additional_information = "";
    var additional_information_origin = document.getElementsByName('additional_information');
    for (var i = 0; i < additional_information_origin.length; i++) {
      if (additional_information_origin[i].checked) {
        if (additional_information !== "") additional_information += ":";
        additional_information += additional_information_origin[i].value;
      }
    };
    var spotsDetailAdditional_information = additional_information;

    var charge_types = "";
    var charge_types_origin = document.getElementsByName('charge_types');
    for (var i = 0; i < charge_types_origin.length; i++) {
      if (charge_types_origin[i].checked) {
        if (charge_types !== "") charge_types += ":";
        charge_types += charge_types_origin[i].value;
      }
    };
    var spotsDetailCharge_types = charge_types;

    var facility_information = "";
    var facility_information_origin = document.getElementsByName('facility_information');
    for (var i = 0; i < facility_information_origin.length; i++) {
      if (facility_information_origin[i].checked) {
        if (facility_information !== "") facility_information += ":";
        facility_information += facility_information_origin[i].value;
      }
    };
    var spotsDetailFacility_information = facility_information;

    var spotsDetailNearby_information = $(this).find('.spot_details_nearby_information').val();
    var spotsDetailSupported_services = $(this).find('.spot_details_supported_services').val();
    var spotsDetailCrowded_time_zone = $(this).find('.spot_details_crowded_time_zone').val();
    if (spotsName == '' || spotsLat == '' || spotsLon == ''
      || spotsSupplierId == '' || spotsDetailId == '') {
      warningMessage('必須項目を入力してください。');
      return;
    }

    console.log(spotsName);
    console.log(spotsLat);
    console.log(spotsLon);
    console.log(spotsCouponId);
    console.log(spotsSupplierId);
    console.log(spotsDetailId);
    console.log(spotsDetailAddress);
    console.log(spotsDetailWeek);
    console.log(spotsDetailSat);
    console.log(spotsDetailSun);
    console.log(spotsDetailHoliday);
    console.log(spotsDetailSales_remarkes);
    console.log(spotsDetailTel);
    console.log(spotsDetailRemarks);
    console.log(spotsDetailStand_1);
    console.log(spotsDetailStand_2);
    console.log(spotsDetailStand_3);
    console.log(spotsDetailAdditional_information);
    console.log(spotsDetailCharge_types);
    console.log(spotsDetailFacility_information);
    console.log(spotsDetailNearby_information);
    console.log(spotsDetailSupported_services);
    console.log(spotsDetailCrowded_time_zone);

    $.ajax({
      url: '/api/management/admin_spot/upsert',
      type: 'post',
      data: {
        id: spotsId,
        name: spotsName,
        lat: spotsLat,
        lon: spotsLon,
        coupon_id: spotsCouponId,
        supplier_id: spotsSupplierId,
        detail_id: spotsDetailId,
        address: spotsDetailAddress,
        week: spotsDetailWeek,
        sat: spotsDetailSat,
        sun: spotsDetailSun,
        holiday: spotsDetailHoliday,
        sales_remarkes: spotsDetailSales_remarkes,
        tel: spotsDetailTel,
        remarks: spotsDetailRemarks,
        stand_1: spotsDetailStand_1,
        stand_2: spotsDetailStand_2,
        stand_3: spotsDetailStand_3,
        additional_information: spotsDetailAdditional_information,
        charge_types: spotsDetailCharge_types,
        facility_information: spotsDetailFacility_information,
        nearby_information: spotsDetailNearby_information,
        supported_services: spotsDetailSupported_services,
        crowded_time_zone: spotsDetailCrowded_time_zone
      },
      beforeSend: function (jqXHR, settings) {
        // 二重送信防止のためボタンを無効化
        $(this).find('submit').attr('disabled', true);
      },
      complete: function (jqXHR, settings) {
        // 送信前に無効化したボタンを有効化
        $(this).find('submit').attr('disabled', false);
      }
    })
      .done(function (result, textStatus, jqXHR) {
        infoMessage('スポット情報の登録・編集が完了しました。');
        // 最新の内容でスポット情報一覧を再描画
        //reloadTable(result);
        location.reload();
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        warningMessage('スポットの登録・編集に失敗しました。')
      });
  });
}

// modal open ボタン (googlemap 描画処理)
$(document).on('click', '#lat_lon_edit', function () {

  $("#latitude_edit").val(document.getElementById("latitude").value);
  $("#longitude_edit").val(document.getElementById("longitude").value);
  $("#address_edit").val(document.getElementById("address").value);

  //何も入力されていない場合の初期位置
  if (document.getElementById("latitude").value == "") {
    $("#latitude_edit").val("35.50908410275354");
    $("#longitude_edit").val("139.61830073682165");
    $("#address_edit").val("神奈川県横浜市港北区新横浜3丁目6-12日総12ビル");
  }

  var mapOptions = {
    zoom: 15,
    center: new google.maps.LatLng(Number($("#latitude_edit").val()), Number($("#longitude_edit").val()))
  };

  var map = new google.maps.Map($("#map-canvas")[0], mapOptions);

  var marker = new google.maps.Marker({
    position: map.getCenter(),
    map: map
  });

  //MAP上でクリック時の処理
  google.maps.event.addListener(map, 'click', function (e) {

    var gc = new google.maps.Geocoder();
    var loc = e.latLng;
    marker.setPosition(loc);
    $("#latitude_edit").val(loc.lat());
    $("#longitude_edit").val(loc.lng());

    gc.geocode({ location: e.latLng }, function (results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        if (results[0].address_components) {
          var adrsData = results[0].address_components;
          var txt = "";
          for (var i = adrsData.length - 2; i > 0; i--) {
            txt += adrsData[i - 1].long_name;
          }
          txt = ztoh(txt).replace("Unnamed Road", "");

          $("#address_edit").val(txt);
          adrsData = "";
        }
      } else {
        alert("住所取得に失敗しました");
        $("#address_edit").val("");
      }
    });
  });

});

// modal内 入力ボタン
$(document).on('click', '#lat_lon_input', function () {
  $("#latitude").val(document.getElementById("latitude_edit").value);
  $("#longitude").val(document.getElementById("longitude_edit").value);
  $("#address").val(document.getElementById("address_edit").value);
});

//全角から半角へ変換
function ztoh(val) {
  var regex = /[Ａ-Ｚａ-ｚ０-９！＂＃＄％＆＇（）＊＋，－．／：；＜＝＞？＠［＼］＾＿｀｛｜｝]/g;
  // 入力値の全角を半角の文字に置換
  value = val
    .replace(regex, function (s) {
      return String.fromCharCode(s.charCodeAt(0) - 0xfee0);
    })
    .replace(/[‐－―−]/g, "-") // ハイフンなど
    .replace(/[～〜]/g, "~") // チルダ
    .replace(/　/g, " "); // スペース

  return value;
}

//入力フォームを非表示にする処理
function form_hide() {
  document.getElementById("edit_form").style.display = "none";
}

// 新規追加ボタン押下処理
function spots_new() {
  $('.spots_id').val(document.getElementById("spot_add").value);
  $('.spots_name').val("");
  $('.spots_lat').val("");
  $('.spots_lon').val("");
  $('.spots_coupon_id').val("");
  $('.spots_supplier_id').val("");
  $('.spots_detail_id').val(document.getElementById("spot_add").value);
  $('.spot_details_address').val("");
  $('.spot_details_week').val("");
  $('.spot_details_sat').val("");
  $('.spot_details_sun').val("");
  $('.spot_details_holiday').val("");
  $('.spot_details_sales_remarkes').val("");
  $('.spot_details_tel').val("");
  $('.spot_details_remarks').val("");
  $('.spot_details_stand_1').val("");
  $('.spot_details_stand_2').val("");
  $('.spot_details_stand_3').val("");
  $('.spot_details_additional_information').val("");
  $('.spot_details_charge_types').val("");
  $('.spot_details_facility_information').val("");
  $('.spot_details_nearby_information').val("");
  $('.spot_details_supported_services').val("");
  $('.spot_details_crowded_time_zone').val("");
  document.getElementById("edit_form").style.display = "block";
}

// map確認 ボタン (googlemap 描画処理)
$(document).on("click", ".spotsMapCheck", function () {
  spotsId = $(this).val().replace(":\d*", "");
  spotsDetailId = $(this).val().replace("\d*:", "");
  clearMessage();

  $.ajax({
    url: '/api/management/admin_spot/index2',
    type: 'post',
    data: {
      id: spotsDetailId
    }
  })
    .done(function (result, textStatus, jqXHR) {
      if (result != undefined) {
        $("#address_check").val(result[0].address);
      }
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      warningMessage('スポット情報の取得に失敗しました。')
    });

  $.ajax({
    url: '/api/management/admin_spot/index',
    type: 'post',
    data: {
      id: spotsId
    }
  })
    .done(function (result, textStatus, jqXHR) {
      if (result != undefined) {

        $("#latitude_check").val(result[0].lat);
        $("#longitude_check").val(result[0].lon);

        var mapOptions = {
          zoom: 15,
          center: new google.maps.LatLng(Number(result[0].lat), Number(result[0].lon))
        };

        var map = new google.maps.Map($("#map-check")[0], mapOptions);

        var marker = new google.maps.Marker({
          position: map.getCenter(),
          map: map
        });
      }
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      warningMessage('スポット情報の取得に失敗しました。')
    });
});
