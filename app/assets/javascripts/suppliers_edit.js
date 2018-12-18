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
      .done(function (result, textStatus, jqXHR) {
        if (result != undefined) {
          $('#id').val(result[0].id);
          $('#name').val(result[0].name);
          $('#poewrSupplySelect').val(result[0].power_supply_types_id);
          $('#value').val(result[0].value);
          $('#producingArea').val(result[0].producing_area);
          $('#origin').val(result[0].origin);
          $('#comment').val(result[0].comment);
          $('#thanksComment').val(result[0].thanks_comment);
        }
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        warning_message('供給者情報の取得に失敗しました。')
      });
  });

  // 削除ボタン押下処理
  $(document).on("click", ".suppliersDelete", function () {
    suppliersId = $(this).val();

    if (!confirm(suppliersId + 'の供給者情報を削除します。よろしいですか？')) {
      return false;
    }
    // 以降は確認ダイアログで「はい」がクリックされた場合の処理
    $.ajax({
      url: '/api/management/supplier/destroy',
      type: 'post',
      data: {
        id: suppliersId
      }
    })
      .done(function (result, textStatus, jqXHR) {
        infoMessage('供給者情報の削除が完了しました。');
        // 最新の内容でクーポン情報一覧を再描画
        //reloadTable(result);
        location.reload();
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        warningMessage('供給者情報の削除に失敗しました。')
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

  if (data.length > 0) {
    var datalist = new Array();
    for (key in data) {
      suppliersId = data[key].id;
      suppliersName = data[key].name;
      suppliersValue = data[key].value;
      powerSupplyTypesId = data[key].power_supply_types_id;
      powerSupplyTypesName = '';
      switch (powerSupplyTypesId) {
        case 0:
          powerSupplyTypesName = powerSupplyData[0].name;
          break;
        case 1:
          powerSupplyTypesName = powerSupplyData[1].name;
          break;
        case 2:
          powerSupplyTypesName = powerSupplyData[2].name;
          break;
      }
      suppliersProducingArea = data[key].producing_area;
      suppliersOrigin = data[key].origin;
      comment = data[key].comment;
      thanksComment = data[key].thanks_comment;

      var rowData = new Array();
      rowData[0] = suppliersId;
      rowData[1] = suppliersName;
      rowData[2] = powerSupplyTypesName;
      rowData[3] = suppliersValue;
      rowData[4] = suppliersProducingArea;
      rowData[5] = suppliersOrigin;
      rowData[6] = comment;
      rowData[7] = thanksComment;
      htmlString = '<button class="btn btn-info suppliersEdit" type="button" value="' + suppliersId + '">編集</button>';
      rowData[8] = htmlString;
      htmlString = '<button class="btn btn-danger suppliersDelete" type="button" value="' + suppliersId + '">削除</button>';
      rowData[9] = htmlString;
      datalist[key] = rowData;
    }

    dt = $('#result-table').DataTable({
      //scrollX: false,
      scrollY: 450,
      retrieve: true,
      ordering: true,
      lengthChange: false,
      searching: true,
      info: false,
      paging: false,
      order: [0, "asc"],
      data: datalist,
      "columnDefs": [
        {
          "searchable": false,
          "orderable": false,
          "targets": [8, 9]
        }
      ]
    });
    dt.columns.adjust();
  }

  // 編集領域に入力した供給者の登録・編集
  $('#supplier_edit_form').submit(function (event) {
    // HTMLでの送信をキャンセル
    event.preventDefault();
    // 通知メッセージ領域・警告メッセージ領域を非表示にする
    clearMessage();

    var suppliersId = $(this).find('#id').val();
    var suppliersName = $(this).find('#name').val();
    var powerSupplyTypesId = $(this).find('#poewrSupplySelect').val();
    var suppliersValue = $(this).find('#value').val();
    var producingArea = $(this).find('#producingArea').val();
    var suppliersOrigin = $(this).find('#origin').val();
    var comment = $(this).find('#comment').val();
    var thanksComment = $(this).find('#thanksComment').val();

    if (suppliersName == '' || suppliersValue == '' || powerSupplyTypesId == '' || producingArea == '' || suppliersOrigin == '') {
      warningMessage('必須項目を入力してください。');
      return;
    }
    $.ajax({
      url: '/api/management/supplier/upsert',
      type: 'post',
      data: {
        id: suppliersId,
        name: suppliersName,
        power_supply_types_id: powerSupplyTypesId,
        value: suppliersValue,
        producing_area: producingArea,
        origin: suppliersOrigin,
        comment: comment,
        thanksComment: thanksComment
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
        infoMessage('供給者情報の登録・編集が完了しました。');
        // 最新の内容で供給者情報一覧を再描画
        //reloadTable(result);
        location.reload();
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        warningMessage('供給者の登録・編集に失敗しました。')
      });
  });
}
