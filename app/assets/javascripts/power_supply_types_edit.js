// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.

$(document).ready(function () {
  reloadTable(data);


  // 編集ボタン押下処理
  $(document).on("click", ".power_supply_typesEdit", function () {
    power_supply_typesId = $(this).val();
    clearMessage();

    $.ajax({
      url: '/api/management/power_supply_type/index',
      type: 'post',
      data: {
        id: power_supply_typesId
      }
    })
      .done(function (result, textStatus, jqXHR) {
        if (result != undefined) {
          $('.power_supply_types_id').val(result[0].id);
          $('.power_supply_types_name').val(result[0].name);
        }
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        warningMessage('電源種別情報の取得に失敗しました。')
      });
  });

  // 削除ボタン押下処理
  $(document).on("click", ".power_supply_typesDelete", function () {
    power_supply_typesId = $(this).val();

    if (!confirm(power_supply_typesId + 'の電源種別情報を削除します。よろしいですか？')) {
      return false;
    }
    // 以降は確認ダイアログで「はい」がクリックされた場合の処理
    $.ajax({
      url: '/api/management/power_supply_type/destroy',
      type: 'post',
      data: {
        id: power_supply_typesId
      }
    })
      .done(function (result, textStatus, jqXHR) {
        infoMessage('電源種別情報の削除が完了しました。');
        // 最新の内容で電源種別情報一覧を再描画
        //reloadTable(result);
        location.reload();
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        warningMessage('電源種別情報の削除に失敗しました。')
      });
  });

});

/**
 * get datatables power_supply_typesId data
 * @param <integer> rowIndex
 */
function getTablepower_supply_typesIdData(rowIndex) {
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


// 引数の内容で電源種別一覧を再描画する
function reloadTable(data) {

  if (data.length > 0) {
    var datalist = new Array();
    for (key in data) {
      power_supply_typesId = data[key].id;
      power_supply_typesName = data[key].name;

      var rowData = new Array();
      rowData[0] = power_supply_typesId;
      rowData[1] = power_supply_typesName;
      htmlString = '<center><button class="btn btn-info power_supply_typesEdit" type="button" value="' + power_supply_typesId + '">編集</button></center>';
      rowData[2] = htmlString;
      htmlString = '<center><button class="btn btn-danger power_supply_typesDelete" type="button" value="' + power_supply_typesId + '">削除</button></center>';
      rowData[3] = htmlString;
      datalist[key] = rowData;
    }

    dt = $('#result-table').DataTable({
      //scrollX: true,
      scrollY: 450,
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
          "targets": [2, 3]
        }
      ]
    });
    dt.columns.adjust();
  }

  // 編集領域に入力した電源種別の登録・編集
  $('#power_supply_types_edit_form').submit(function (event) {
    // HTMLでの送信をキャンセル
    event.preventDefault();
    // 通知メッセージ領域・警告メッセージ領域を非表示にする
    clearMessage();

    var power_supply_typesId = $(this).find('.power_supply_types_id').val();
    var power_supply_typesName = $(this).find('.power_supply_types_name').val();

    if (power_supply_typesName == '') {
      warningMessage('すべての項目を入力してください。');
      return;
    }
    console.log(power_supply_typesName);
    $.ajax({
      url: '/api/management/power_supply_type/upsert',
      type: 'post',
      data: {
        id: power_supply_typesId,
        name: power_supply_typesName
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
        infoMessage('電源種別情報の登録・編集が完了しました。');
        // 最新の内容で電源種別情報一覧を再描画
        //reloadTable(result);
        location.reload();
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        warningMessage('電源種別の登録・編集に失敗しました。')
      });
  });
}
