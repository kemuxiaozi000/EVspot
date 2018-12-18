// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.

$(document).ready(function () {
  reloadTable(data);


  // 編集ボタン押下処理
  $(document).on("click", ".suppliersEdit", function () {
    suppliersId = $(this).val();
    clearMessage();

    $.ajax({
      url: '/api/management/supplier/index',
      type: 'post',
      data: {
        id: suppliersId
      }
    })
    .done(function(result, textStatus, jqXHR) {
      if (result != undefined) {
        $('.suppliers_id').val(result[0].id);
        $('.suppliers_name').val(result[0].name);
        $('.power_supply_types').val(result[0].power_supply_types_id);
        $('.suppliers_value').val(result[0].value);
        $('.producing_area').val(result[0].producing_area);
        $('.origin').val(result[0].origin);
      }
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
      warning_message('供給者情報の取得に失敗しました。')
    });
  });

  // 削除ボタン押下処理
  $(document).on("click", ".suppliersDelete", function () {
    key = $(this).val();
    suppliersId = getTableSuppliersIdData(key);

    if (!confirm(suppliersId + 'の供給者情報を削除します。よろしいですか？')) {
      return false;
    }
      // 以降は確認ダイアログで「はい」がクリックされた場合の処理
    $.ajax({
      url: '/user_manage/delete',
      type: 'post',
      data: {
        id: suppliersId
      }
    })
    .done(function(result, textStatus, jqXHR) {
      info_message('供給者情報の削除が完了しました。');
      // 最新の内容で供給者情報一覧を再描画
      //reloadTable(result);
      location.reload();
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
      warning_message('供給者情報の削除に失敗しました。')
    });
  });

});

/**
 * get datatables suppliersId data
 * @param <integer> rowIndex
 */
function getTableSuppliersIdData(rowIndex) {
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


// 引数の内容で供給者一覧を再描画する
function reloadTable(data) {

  if(data.length > 0) {
    var datalist = new Array();
    for (key in data) {
      suppliersId = data[key].id;
      suppliersName = data[key].name;
      suppliersValue = data[key].value;
      powerSupplyTypesId = data[key].power_supply_types_id;
      powerSupplyTypesName = '';
      switch (powerSupplyTypesId) {
        case 0:
          powerSupplyTypesName = 'クリーンエネルギー';
          break;
        case 1:
          powerSupplyTypesName = 'レガシーエネルギー';
          break;
        case 2:
          powerSupplyTypesName = 'その他のエネルギー';
          break;
      }
      suppliersProducingArea = data[key].producing_area;
      suppliersOrigin = data[key].origin;

      var rowData = new Array();
      htmlString = '<span class="glyphicon glyphicon-user"></span>';
      rowData[0] = htmlString;
      rowData[1] = suppliersId;
      rowData[2] = suppliersName;
      rowData[3] = powerSupplyTypesName;
      rowData[4] = suppliersValue;
      rowData[5] = suppliersProducingArea;
      rowData[6] = suppliersOrigin;
      htmlString = '<button class="btn btn-info suppliersEdit" type="button" value="' + suppliersId + '">編集</button>';
      rowData[7] = htmlString;
      datalist[key] = rowData;
    }

    dt = $('#result-table').DataTable({
      //scrollX: false,
      scrollY: 450,
      retrieve: true,
      ordering: true,
      lengthChange: false,
      searching: false,
      info: false,
      paging: false,
      order: [1, "asc"],
      data: datalist,
      "columnDefs": [
       {
         "searchable": false,
         "orderable": false,
         "targets": [0, 7]
       }
       ]
    });
    dt.columns.adjust();
  }

  // 編集領域に入力した供給者の登録・編集
  $('#supplier_edit_form').submit(function(event) {
    // HTMLでの送信をキャンセル
    event.preventDefault();
    // 通知メッセージ領域・警告メッセージ領域を非表示にする
    clearMessage();

    var suppliersId = $(this).find('.suppliers_id').val();
    var suppliersName = $(this).find('.suppliers_name').val();
    var powerSupplyTypesId = $(this).find('.power_supply_types').val();
    var suppliersValue = $(this).find('.suppliers_value').val();
    var producingArea = $(this).find('.producing_area').val();
    var suppliersOrigin = $(this).find('.origin').val();

    if (suppliersName == '' || suppliersValue == '' || powerSupplyTypesId =='' || producingArea ==''  || suppliersOrigin =='' ) {
      warningMessage('すべての項目を入力してください。');
      return;
    }
    console.log(suppliersName);
    console.log(suppliersValue);
    console.log(powerSupplyTypesId);
    console.log(producingArea);
    console.log(suppliersOrigin);
    $.ajax({
      url: '/api/management/supplier/upsert',
      type: 'post',
      data: {
        id: suppliersId,
        name: suppliersName,
        power_supply_types_id : powerSupplyTypesId,
        value: suppliersValue,
        producing_area: producingArea,
        origin: suppliersOrigin
      },
      beforeSend: function(jqXHR, settings) {
        // 二重送信防止のためボタンを無効化
        $(this).find('submit').attr('disabled', true);
      },
      complete: function(jqXHR, settings) {
        // 送信前に無効化したボタンを有効化
        $(this).find('submit').attr('disabled', false);
      }
    })
    .done(function(result, textStatus, jqXHR) {
      infoMessage('供給者情報の登録・編集が完了しました。');
      // 最新の内容で供給者情報一覧を再描画
      //reloadTable(result);
      location.reload();
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
      warningMessage('供給者の登録・編集に失敗しました。')
    });
  });
}
