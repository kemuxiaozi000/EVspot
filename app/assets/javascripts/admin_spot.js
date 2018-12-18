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

      var rowData = new Array();
      htmlString = '<span class="glyphicon glyphicon-user"></span>';
      rowData[0] = htmlString;
      rowData[1] = spotsId;
      rowData[2] = spotsName;
      rowData[3] = spotsLat;
      rowData[4] = spotsLon;
      rowData[5] = spotsCouponId;
      rowData[6] = spotsSupplierId;
      rowData[7] = spotsDetailId;
      htmlString = '<center><button class="btn btn-info spotsEdit" type="button" value="' + spotsId + '">編集</button></center>';
      rowData[8] = htmlString;
      htmlString = '<center><button class="btn btn-info spotsDelete" type="button" value="' + spotsId + '">削除</button></center>';
      rowData[9] = htmlString;
      datalist[key] = rowData;
    }

    dt = $('#result-table').DataTable({
      //scrollX: false,
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
          "targets": [0, 8, 9]
        }
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

    if (spotsName == '' || spotsLat == '' || spotsLon == ''
      || spotsCouponId == '' || spotsSupplierId == '' || spotsDetailId == '') {
      warningMessage('すべての項目を入力してください。');
      return;
    }

    console.log(spotsName);
    console.log(spotsLat);
    console.log(spotsLon);
    console.log(spotsCouponId);
    console.log(spotsSupplierId);
    console.log(spotsDetailId);

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
        detail_id: spotsDetailId
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
