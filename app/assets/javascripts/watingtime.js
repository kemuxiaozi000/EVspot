$(document).ready(function () {
  reloadTable(data);

  // 引数の内容でcommon一覧を再描画する
  function reloadTable(data) {
    if (data.length > 0) {
      var datalist = new Array();
      for (key in data) {
        var commonId = data[key].id;
        var commonName = data[key].name;
        var commonValue = data[key].value;

        var rowData = new Array();
        rowData[0] = commonId;
        rowData[1] = commonName;
        rowData[2] = commonValue;
        var htmlString = '<button class="btn btn-info watingtime_update" type="button" value="' + commonId + '">編集</button>';
        rowData[3] = htmlString;
        datalist[key] = rowData;
      }

      dt = $('#result-table').DataTable({
        //scrollX: false,
        scrollY: 450,
        retrieve: true,
        ordering: false,
        lengthChange: false,
        searching: false,
        info: false,
        paging: false,
        order: [1, "asc"],
        data: datalist,
        columnDefs: [
          { className: 'col-xs-2', 'targets': [0, 3] },
          { className: 'col-xs-4', 'targets': [1, 2] }
        ]
      });
      dt.columns.adjust();

    }
  }

  // 登録処理
  $('#common_form').submit(function (event) {
    // HTMLでの送信をキャンセル
    event.preventDefault();

    var commonId = $(this).find('.time_control_types').val();
    var commonValue = $(this).find('.time_value').val();
    if (commonValue != "") {
      $.ajax({
        url: '/api/management/common_time/upsert',
        type: 'post',
        data: {
          id: commonId,
          value: commonValue
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
          // 最新の内容でcommon情報一覧を再描画
          //reloadTable(result);
          location.reload();
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
          console.log(errorThrown);
        });
    }
  });

  // 編集ボタン押下処理
  $(document).on("click", ".watingtime_update", function () {
    var id = $(this).val();

    $.ajax({
      url: '/api/management/common_time/index',
      type: 'post',
      data: {
        id: id
      }
    })
      .done(function (result, textStatus, jqXHR) {
        if (result != undefined) {
          $('.time_control_types').val(result[0].id);
          $('.time_value').val(result[0].value);
        }
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        console.log(errorThrown);
      });
  });

});