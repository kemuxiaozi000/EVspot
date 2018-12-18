// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.

$(document).ready(function () {
  reloadTable(data);


  // 編集ボタン押下処理
  $(document).on("click", ".couponsEdit", function () {
    couponsId = $(this).val();
    clearMessage();
    $.ajax({
      url: '/api/management/admin_coupon/index',
      type: 'post',
      data: {
        id: couponsId
      }
    })
      .done(function (result, textStatus, jqXHR) {
        if (result != undefined) {
          $('.coupons_id').val(result[0].id);
          $('.coupons_title').val(result[0].title);
          $('.coupons_message').val(result[0].message);
          $('.coupons_from_date').val(result[0].from_date);
          $('.coupons_to_date').val(result[0].to_date);
        }
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        warningMessage('クーポン情報の取得に失敗しました。')
      });
  });

  // 削除ボタン押下処理
  $(document).on("click", ".couponsDelete", function () {
    couponsId = $(this).val();
    if (!confirm(couponsId + 'のクーポン情報を削除します。よろしいですか？')) {
      return false;
    }
    // 以降は確認ダイアログで「はい」がクリックされた場合の処理
    $.ajax({
      url: '/api/management/admin_coupon/destroy',
      type: 'post',
      data: {
        id: couponsId
      }
    })
      .done(function (result, textStatus, jqXHR) {
        infoMessage('クーポン情報の削除が完了しました。');

        // 最新の内容でクーポン情報一覧を再描画
        //reloadTable(result);
        location.reload();
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        warningMessage('クーポン情報の削除に失敗しました。')
      });
  });

});


/**
 * get datatables couponsId data
 * @param <integer> rowIndex
 */
function getTableCouponsIdData(rowIndex) {
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


// 引数の内容でクーポン一覧を再描画する
function reloadTable(data) {

  if (data.length > 0) {
    var datalist = new Array();
    for (key in data) {
      couponsId = data[key].id;
      couponsTitle = data[key].title;
      couponsMessage = data[key].message;
      couponsFromDate = data[key].from_date;
      couponsToDate = data[key].to_date;

      var rowData = new Array();
      rowData[0] = couponsId;
      rowData[1] = couponsTitle;
      rowData[2] = couponsMessage;
      rowData[3] = couponsFromDate;
      rowData[4] = couponsToDate;
      htmlString = '<center><button class="btn btn-info couponsEdit" type="button" value="' + couponsId + '">編集</button></center>';
      rowData[5] = htmlString;
      htmlString = '<center><button class="btn btn-danger couponsDelete" type="button" value="' + couponsId + '">削除</button></center>';
      rowData[6] = htmlString;
      datalist[key] = rowData;
    }

    dt = $('#result-table').DataTable({
      //scrollX: true,
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
          "targets": [5, 6]
        }
      ]
    });
    dt.columns.adjust();
  }

  // 編集領域に入力した供給者の登録・編集
  $('#admin_coupon_form').submit(function (event) {
    // HTMLでの送信をキャンセル
    event.preventDefault();
    // 通知メッセージ領域・警告メッセージ領域を非表示にする
    clearMessage();

    var couponsId = $(this).find('.coupons_id').val();
    var couponsTitle = $(this).find('.coupons_title').val();
    var couponsMessage = $(this).find('.coupons_message').val();
    var couponsFromDate = $(this).find('.coupons_from_date').val();
    var couponsToDate = $(this).find('.coupons_to_date').val();

    if (couponsTitle == '' || couponsMessage == '' || couponsFromDate == ''
      || couponsToDate == '') {
      warningMessage('すべての項目を入力してください。');
      return;
    }
    console.log(couponsTitle);
    console.log(couponsMessage);
    console.log(couponsFromDate);
    console.log(couponsToDate);
    $.ajax({
      url: '/api/management/admin_coupon/upsert',
      type: 'post',
      data: {
        id: couponsId,
        title: couponsTitle,
        message: couponsMessage,
        from_date: couponsFromDate,
        to_date: couponsToDate
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
        infoMessage('クーポン情報の登録・編集が完了しました。');
        // 最新の内容でクーポン情報一覧を再描画
        //reloadTable(result);
        location.reload();
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        warningMessage('クーポンの登録・編集に失敗しました。')
      });
  });
}
